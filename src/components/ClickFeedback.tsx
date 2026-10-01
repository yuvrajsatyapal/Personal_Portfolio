import { useEffect, useState } from "react";
import { site } from "../data/portfolio";
interface Burst { id: number; x: number; y: number }

export default function ClickFeedback() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  useEffect(() => {
    const config = site.clickFeedback;
    const audio = new Audio(config.sound);
    audio.volume = config.volume;
    audio.preload = "auto";
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let nextId = 0;
    const click = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-click-feedback="off"]')) {
        audio.pause();
        audio.currentTime = 0;
        timers.forEach(clearTimeout);
        timers.clear();
        setBursts([]);
        return;
      }
      if (event.target instanceof Element && event.target.closest("[disabled], [aria-disabled='true']")) return;
      try {
        audio.currentTime = 0;
        void audio.play()?.catch(() => {});
      } catch { /* Playback restrictions must not interrupt the click. */ }
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      let x = event.clientX, y = event.clientY;
      if (event.detail === 0 && event.target instanceof Element) {
        const rect = event.target.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
      const id = nextId++;
      setBursts(current => [...current.slice(-19), { id, x, y }]);
      const timer = setTimeout(() => {
        setBursts(current => current.filter(burst => burst.id !== id));
        timers.delete(timer);
      }, config.duration);
      timers.add(timer);
    };
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("click", click, true);
      timers.forEach(clearTimeout);
      audio.pause();
    };
  }, []);
  return <div className="click-feedback" aria-hidden="true">
    {bursts.map(burst => <svg key={burst.id} className="click-spark-burst" viewBox="-40 -40 80 80" style={{ left: burst.x, top: burst.y }}>
      {Array.from({ length: site.clickFeedback.sparkCount }, (_, index) =>
        <g key={index} transform={`rotate(${index * 360 / site.clickFeedback.sparkCount})`}>
          <line className="click-spark-ray" x1="0" y1="0" x2="12" y2="0" />
        </g>
      )}
    </svg>)}
  </div>;
}
