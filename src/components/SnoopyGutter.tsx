import { useEffect, useState } from "react";
import { chooseBehavior, clampX, createPlan, createTransferPlan, eligible, sampleStep, type Actor, type Behavior, type Plan, type Scene, type Side } from "./snoopy-behavior";
import "./SnoopyGutter.css";

const directory = "/sprites/snoopy/";
const restingScene = (gutter: number): Scene => ({ snoopy: { image: "snoopy-rest", x: clampX(gutter - 56, gutter), width: 36, height: 48 }, label: "idle" });
const preload = ["snoopy-rest","snoopy-idle","snoopy-walk-1","snoopy-walk-2","snoopy-right-idle","snoopy-right-walk-1","snoopy-right-walk-2","snoopy-front","snoopy-three-quarter","snoopy-back","z-1","z-2"];

/** Remove from App, or pass enabled={false}, to disable the whole character system. */
export default function SnoopyGutter({ enabled = true }: { enabled?: boolean }) {
  const [preferences, setPreferences] = useState({ wide: false, reduced: false, width: 0 });
  const [display, setDisplay] = useState<{ scene: Scene; behavior: Behavior; side: Side }>({ scene: restingScene(202), behavior: "idle", side: "left" });
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const desktop = window.matchMedia("(min-width: 1152px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPreferences({ wide: desktop.matches, reduced: motion.matches, width: window.innerWidth });
    update();
    desktop.addEventListener("change", update);
    motion.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      desktop.removeEventListener("change", update);
      motion.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const gutter = (preferences.width - 748) / 2;
    const staticScene = restingScene(Math.max(202, gutter));
    setDisplay({ scene: staticScene, behavior: "idle", side: "left" });
    if (!enabled || !preferences.wide || preferences.reduced) return;
    for (const name of preload) { const image = new Image(); image.src = `${directory}${name}.png`; }
    let position = staticScene.snoopy!.x;
    let side: Side = "left";
    let transferNext = true;
    let plan: Plan = { behavior: "idle", endX: position, steps: [{ duration: 3000, snoopy: staticScene.snoopy!, label: "idle" }] };
    let index = 0;
    let elapsed = 0;
    let activeTime = 0;
    let last = Date.now();
    let running = false;
    let scrolling = false;
    let visible = document.visibilityState === "visible";
    let lastBehavior: Behavior | undefined;
    const used: Partial<Record<Behavior, number>> = {};
    let pending: { behavior: Behavior; expires: number } | undefined;
    let lastReaction = -20000;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    const step = () => plan.steps[index];
    const publish = () => setDisplay({ scene: sampleStep(step(), elapsed), behavior: plan.behavior, side });
    const accrue = () => {
      if (running) { const delta = Date.now() - last; elapsed += delta; activeTime += delta; }
      last = Date.now();
    };
    const begin = (behavior: Behavior) => {
      plan = behavior === "walk" && transferNext ? createTransferPlan(position, gutter, side) : createPlan(behavior, position, gutter, Math.random);
      if (behavior === "walk") transferNext = !transferNext;
      index = 0;
      elapsed = 0;
      if (behavior !== "idle") { used[behavior] = activeTime; lastBehavior = behavior; }
    };
    const reactionReady = () => {
      if (pending && Date.now() > pending.expires) pending = undefined;
      return pending && plan.behavior === "idle" && elapsed >= 2000 && !scrolling && activeTime - lastReaction >= 20000 && eligible(pending.behavior, lastBehavior, used, activeTime);
    };
    const nextIsWalk = () => plan.steps[index + 1]?.snoopy.to !== undefined;
    const schedule = () => {
      clearTimeout(timer);
      timer = undefined;
      running = false;
      if (!visible || (scrolling && (plan.behavior === "idle" || (elapsed >= step().duration && nextIsWalk())))) return;
      let delay = step().duration - elapsed;
      const moving = step().snoopy.to !== undefined || step().bird?.to !== undefined;
      if (moving) delay = Math.min(delay, 40 - elapsed % 40, 180 - elapsed % 180);
      if (step().z !== undefined) {
        const start = step().z!;
        const boundary = [start,start + 1000,start + 2000].find(value => value > elapsed);
        if (boundary !== undefined) delay = Math.min(delay, boundary - elapsed);
      }
      if (pending && (Date.now() > pending.expires || !eligible(pending.behavior, lastBehavior, used, activeTime))) pending = undefined;
      if (pending && plan.behavior === "idle" && !scrolling) delay = Math.min(delay, Math.max(1, 2000 - elapsed));
      last = Date.now();
      running = true;
      timer = setTimeout(() => {
        accrue();
        running = false;
        if (reactionReady()) {
          const behavior = pending!.behavior;
          pending = undefined;
          lastReaction = activeTime;
          begin(behavior);
        } else if (elapsed >= step().duration) {
          if (index + 1 < plan.steps.length) {
            if (!(scrolling && nextIsWalk())) { index++; elapsed = 0; }
          } else {
            position = plan.endX;
            side = plan.endSide || side;
            if (plan.behavior === "idle") begin(chooseBehavior(lastBehavior, used, activeTime, Math.random));
            else begin("idle");
          }
        }
        publish();
        schedule();
      }, Math.max(1, delay));
    };
    const onScroll = () => {
      accrue();
      scrolling = true;
      clearTimeout(scrollTimer);
      publish();
      schedule();
      if (visible) scrollTimer = setTimeout(() => {
        accrue(); scrolling = false; publish(); schedule();
      }, 1000);
    };
    const onVisibility = () => {
      accrue();
      visible = document.visibilityState === "visible";
      clearTimeout(scrollTimer);
      scrollTimer = undefined;
      scrolling = false;
      if (!visible) pending = undefined;
      publish(); schedule();
    };

    // Discover existing sections locally; no changes to the portfolio sections are needed.
    const seen = new Set<string>();
    const watched = new WeakSet<Element>();
    let observer: IntersectionObserver | undefined;
    let mutation: MutationObserver | undefined;
    if (typeof IntersectionObserver === "function") {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < .25 || !visible) continue;
          const title = entry.target.querySelector("h2")?.textContent || entry.target.id;
          const key = `${window.location.pathname}:${title}`;
          if (seen.has(key)) continue;
          seen.add(key);
          if (pending || activeTime - lastReaction < 20000) continue;
          const behavior: Behavior = "look";
          if (!eligible(behavior, lastBehavior, used, activeTime)) continue;
          pending = { behavior, expires: Date.now() + 10000 };
          accrue(); schedule();
        }
      }, { threshold: .25 });
      const discover = () => document.querySelectorAll("#experience, .project-section, .activity-section").forEach(section => {
        if (!watched.has(section)) { watched.add(section); observer!.observe(section); }
      });
      discover();
      const main = document.querySelector("main");
      if (main) { mutation = new MutationObserver(discover); mutation.observe(main, { childList: true, subtree: true }); }
    }
    publish(); schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer); clearTimeout(scrollTimer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect(); mutation?.disconnect();
    };
  }, [enabled, preferences.wide, preferences.reduced, preferences.width]);

  if (!enabled || !preferences.wide) return null;
  const scene = preferences.reduced ? restingScene((preferences.width - 748) / 2) : display.scene;
  const activeSide = preferences.reduced ? "left" : display.side;
  const actorImage = (actor: Actor, className: string) => <img className={className} src={`${directory}${actor.image}.png`} alt="" width={actor.width} height={actor.height} draggable={false} style={{ left: actor.x, width: actor.width, height: actor.height, transform: actor.mirrored ? "scaleX(-1)" : undefined }} />;
  const sleeper = scene.house || scene.snoopy;
  return <>{(["left","right"] as Side[]).map(gutterSide => {
    const belongs = (actor: Actor | null | undefined) => actor && (actor.side || activeSide) === gutterSide;
    return <div key={gutterSide} className={`snoopy-gutter snoopy-gutter-${gutterSide}`} aria-hidden="true" data-state={scene.label} data-behavior={preferences.reduced ? "idle" : display.behavior}>
      {belongs(scene.snoopy) && actorImage(scene.snoopy!, "snoopy-character")}
      {scene.z && sleeper && belongs(sleeper) && <img className="snoopy-z" src={`${directory}${scene.z}.png`} alt="" width={scene.z === "z-1" ? 12 : 16} height={scene.z === "z-1" ? 14 : 16} draggable={false} style={{ left: sleeper.x + 12, bottom: 8 + sleeper.height + 2 }} />}
    </div>;
  })}</>;
}
