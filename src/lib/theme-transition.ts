let transitioning = false;

/** Reveal the updated theme using the root snapshot; fall back to an instant switch. */
export async function transitionTheme(update: () => void): Promise<void> {
  if (transitioning) return;
  if (!document.startViewTransition || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    update();
    return;
  }
  transitioning = true;
  let applied = false;
  const apply = () => {
    if (applied) return;
    applied = true;
    update();
  };
  try {
    const transition = document.startViewTransition(apply);
    await transition.finished;
  } catch {
    apply();
  } finally {
    transitioning = false;
  }
}
