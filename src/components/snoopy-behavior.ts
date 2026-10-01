export type Behavior = "idle" | "walk" | "look" | "nap";
export type Random = () => number;
export type Side = "left" | "right";
export type Actor = { image: string; x: number; width: number; height: number; to?: number; gait?: string; mirrored?: boolean; side?: Side };
export type Step = { duration: number; snoopy: Actor; bird?: Actor; house?: Actor; z?: number; label: string };
export type Plan = { behavior: Behavior; steps: Step[]; endX: number; endSide?: Side };
export type Scene = { snoopy: Actor | null; bird?: Actor; house?: Actor; z?: "z-1" | "z-2"; label: string };
export const cooldowns: Partial<Record<Behavior, number>> = {};
const weights: [Behavior, number][] = [["idle",30],["walk",28],["look",20],["nap",14]];
const pick = <T,>(values: T[], random: Random): T => values[Math.min(values.length - 1, Math.floor(random() * values.length))];
export const clampX = (x: number, gutter: number, width = 36) => Math.max(24, Math.min(Math.floor(x / 2) * 2, Math.floor((gutter - 20 - width) / 2) * 2));
export function eligible(behavior: Behavior, last: Behavior | undefined, used: Partial<Record<Behavior, number>>, now: number) {
  return behavior === "idle" || (behavior !== last && (used[behavior] === undefined || now - used[behavior]! >= (cooldowns[behavior] || 0)));
}
export function chooseBehavior(last: Behavior | undefined, used: Partial<Record<Behavior, number>>, now: number, random: Random): Behavior {
  const available = weights.filter(([behavior]) => eligible(behavior, last, used, now));
  let value = random() * available.reduce((sum, [,weight]) => sum + weight, 0);
  for (const [behavior, weight] of available) { value -= weight; if (value < 0) return behavior; }
  return available.at(-1)![0];
}
const normal = (x: number, image = "snoopy-rest"): Actor => ({ image, x, width: 36, height: 48 });
const stationary = (x: number, duration: number, image = "snoopy-rest", label = "idle"): Step => ({ duration, snoopy: normal(x, image), label });
function walking(x: number, to: number): Actor {
  const direction = to > x ? "right" : "left";
  return { image: direction === "right" ? "snoopy-right-idle" : "snoopy-idle", x, to, width: 36, height: 48, gait: direction === "right" ? "snoopy-right-walk" : "snoopy-walk" };
}
function destination(x: number, gutter: number, random: Random, distances: number[], width = 36) {
  const distance = pick(distances, random);
  let direction = random() < .5 ? -1 : 1;
  if (Math.abs(clampX(x + direction * distance, gutter, width) - x) < 24) direction *= -1;
  return clampX(x + direction * distance, gutter, width);
}
export function createPlan(behavior: Behavior, start: number, gutter: number, random: Random): Plan {
  let x = clampX(start, gutter);
  const steps: Step[] = [];
  if (behavior === "idle") {
    steps.push(stationary(x, pick([3000,4000,5000,6000,7000], random)));
  } else if (behavior === "walk") {
    const to = destination(x, gutter, random, [24,48,72,100]);
    const actor = walking(x, to);
    steps.push({ duration: 2000, snoopy: { ...actor, to: undefined, gait: undefined }, label: "standing" });
    steps.push({ duration: Math.max(400, Math.abs(to - x) * 20), snoopy: actor, label: "walking" });
    steps.push(stationary(to, 500));
    x = to;
    steps.push(stationary(x, 300));
  } else if (behavior === "look") {
    steps.push(stationary(x, 900, pick(["snoopy-front","snoopy-three-quarter","snoopy-back"], random), "looking"));
    steps.push(stationary(x, 1400, pick(["snoopy-idle","snoopy-right-idle"], random), "looking"));
    steps.push(stationary(x, 300));
  } else if (behavior === "nap") {
    const duration = pick([6000,8000,10000], random);
    steps.push({ ...stationary(x, duration, "snoopy-rest", "napping"), z: duration / 2 });
  }
  if (behavior === "look" || behavior === "nap") steps.unshift(stationary(clampX(start, gutter), 2000, "snoopy-idle", "standing"));
  return { behavior, steps, endX: x };
}
export function createTransferPlan(start: number, gutter: number, side: Side): Plan {
  const endSide: Side = side === "left" ? "right" : "left";
  const exit = side === "left" ? -36 : gutter;
  const entry = endSide === "left" ? -36 : gutter;
  const endX = endSide === "left" ? clampX(gutter - 56, gutter) : 24;
  const outward = { ...walking(start, exit), side };
  const inward = { ...walking(entry, endX), side: endSide };
  return { behavior: "walk", endX, endSide, steps: [
    { duration: 2000, snoopy: { ...outward, to: undefined, gait: undefined }, label: "standing" },
    { duration: Math.max(800, Math.abs(exit - start) * 10), snoopy: outward, label: "leaving-gutter" },
    { duration: 400, snoopy: { ...outward, x: exit, to: undefined, gait: undefined }, label: "between-gutters" },
    { duration: Math.max(800, Math.abs(endX - entry) * 10), snoopy: inward, label: "entering-gutter" },
    { ...stationary(endX, 300), snoopy: { ...normal(endX), side: endSide } },
  ] };
}
export function sampleStep(step: Step, elapsed: number): Scene {
  const sample = (actor: Actor): Actor => {
    const distance = (actor.to ?? actor.x) - actor.x;
    const moved = Math.min(Math.abs(distance), Math.floor(Math.abs(distance) * Math.min(elapsed / step.duration, 1) / 2) * 2);
    return { ...actor, x: actor.x + Math.sign(distance) * moved, image: actor.gait ? `${actor.gait}-${Math.floor(elapsed / 180) % 2 + 1}` : actor.image };
  };
  const sleep = step.z !== undefined && elapsed >= step.z && elapsed < step.z + 2000;
  return { snoopy: step.house ? null : sample(step.snoopy), bird: step.bird && sample(step.bird), house: step.house && sample(step.house), z: sleep ? elapsed < step.z! + 1000 ? "z-1" : "z-2" : undefined, label: step.label };
}
