import { useEffect, useRef } from "react";

type Segment = [number, number, number, number];
type Tip = { x: number; y: number; angle: number; family: { count: number } };

/** Short, gently diverging strokes give the reference its fine branching texture. */
export function createBranches(width: number, height: number, seed: number): Segment[] {
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const segments: Segment[] = [];
  let tips: Tip[] = [
    { x: -5, y: height * .28, angle: 0, family: { count: 0 } },
    { x: width + 5, y: height * .72, angle: Math.PI, family: { count: 0 } },
    { x: width * .4, y: -5, angle: Math.PI / 2, family: { count: 0 } },
    { x: width * .65, y: height + 5, angle: -Math.PI / 2, family: { count: 0 } },
  ];
  for (let generation = 0; tips.length && generation < 1600 && segments.length < 12000; generation++) {
    const next: Tip[] = [];
    for (const tip of tips) {
      const length = random() * 6;
      const x = tip.x + Math.cos(tip.angle) * length;
      const y = tip.y + Math.sin(tip.angle) * length;
      segments.push([tip.x, tip.y, x, y]);
      if (segments.length >= 12000) break;
      if (x < -12 || x > width + 12 || y < -12 || y > height + 12) continue;
      tip.family.count++;
      const probability = tip.family.count < 30 ? .8 : .5;
      for (const direction of [-1, 1]) {
        const angle = tip.angle + direction * random() * Math.PI / 12;
        if (random() < probability) next.push({ x, y, angle, family: tip.family });
      }
    }
    tips = next;
  }
  return segments;
}

function BranchGutter({ side }: { side: "left" | "right" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let frame = 0;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const draw = () => {
      cancelAnimationFrame(frame);
      const canvas = ref.current;
      if (!canvas || window.innerWidth < 1024) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      const width = (window.innerWidth - 748) / 2;
      const height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(width * ratio);
      canvas.height = height * ratio;
      context.scale(ratio, ratio);
      context.lineWidth = 1;
      context.strokeStyle = "#888";
      const segments = createBranches(width, height, side === "left" ? 73 : 129);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let index = 0;
      let previous = 0;
      const paint = (time: number) => {
        if (time - previous >= 40 || reduced) {
          previous = time;
          const end = reduced ? segments.length : Math.min(index + 20, segments.length);
          context.beginPath();
          for (; index < end; index++) {
            const [x, y, ex, ey] = segments[index];
            context.moveTo(x, y);
            context.lineTo(ex, ey);
          }
          context.stroke();
        }
        if (index < segments.length) frame = requestAnimationFrame(paint);
      };
      frame = requestAnimationFrame(paint);
    };
    const resize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(draw, 150); };
    let theme = document.documentElement.dataset.theme;
    const themeObserver = new MutationObserver(() => {
      const next = document.documentElement.dataset.theme;
      if (next === theme) return;
      theme = next;
      clearTimeout(resizeTimer);
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    draw();
    window.addEventListener("resize", resize);
    return () => { themeObserver.disconnect(); cancelAnimationFrame(frame); clearTimeout(resizeTimer); window.removeEventListener("resize", resize); };
  }, [side]);
  return <canvas ref={ref} className={`side-pattern-gutter side-pattern-${side}`} />;
}

export default function SidePattern() {
  return (
    <div className="side-pattern" aria-hidden="true">
      <BranchGutter side="left" />
      <BranchGutter side="right" />
    </div>
  );
}
