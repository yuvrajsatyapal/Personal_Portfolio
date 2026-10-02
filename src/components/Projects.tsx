import { useEffect, useRef, useState } from "react";
import { FiPause, FiPlay } from "react-icons/fi";
import { Link } from "react-router-dom";
import { projects, type Project } from "../data/portfolio";
import { External, Title } from "./Shared";
import Icon from "./Icon";
export function ProjectCard({ project: p, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const [open, setOpen] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const wantsPreview = useRef(false);
  const [previewRequested, setPreviewRequested] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  function stopPreview() {
    wantsPreview.current = false;
    setPreviewRequested(false);
    setPlaying(false);
  }

  function startPreview() {
    if (!p.video || previewFailed) return;
    wantsPreview.current = true;
    setPreviewLoaded(true);
    setPreviewRequested(true);
  }

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    let cancelled = false;
    if (previewRequested) {
      void player.play().then(() => {
        if (!cancelled && wantsPreview.current) setPlaying(true);
        else if (!wantsPreview.current) player.pause();
      }).catch(() => {
        if (!cancelled) {
          setPreviewFailed(true);
          stopPreview();
        }
      });
    } else {
      player.pause();
      player.currentTime = 0;
    }
    return () => { cancelled = true; };
  }, [previewRequested]);

  return (
    <article
      id={"project-" + p.id}
      className={"project-card" + (p.featured ? " featured-project" : "")}
      onMouseEnter={event => {
        if (event.target instanceof Element && event.target.closest(".project-preview-toggle")) return;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || window.matchMedia?.("(hover: none)").matches) return;
        startPreview();
      }}
      onMouseLeave={stopPreview}
    >
      <div className="banner">
        <picture>
        {p.imageKind === "screenshot" && <source
          type="image/webp"
          srcSet={`${p.image.replace(".png", "-700.webp")} 700w, ${p.image.replace(".png", "-1400.webp")} 1400w`}
          sizes="(max-width: 700px) 100vw, 700px"
        />}
        <img
          src={p.image}
          alt={
            p.name +
            (p.imageKind === "screenshot"
              ? " — website screenshot"
              : " — illustrative interface preview")
          }
          width={3390} height={1900}
          loading="lazy" decoding="async"
        />
        </picture>
        {p.video && (
          <video
            ref={video}
            className={"project-preview-video" + (playing ? " is-playing" : "")}
            src={previewLoaded ? p.video : undefined}
            poster={p.image}
            muted loop playsInline preload="none" aria-hidden="true"
            onError={() => { setPreviewFailed(true); stopPreview(); }}
          />
        )}
        {p.video && !previewFailed && (
          <button
            className="project-preview-toggle"
            aria-label={`${previewRequested ? "Pause" : "Play"} ${p.name} preview`}
            aria-pressed={previewRequested}
            onClick={() => { if (previewRequested) stopPreview(); else startPreview(); }}
          >
            {previewRequested ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
          </button>
        )}
        {p.featured && (
          <div className="stats-badge">
            <span className="stats-text">Featured project</span>
          </div>
        )}
        {p.imageKind !== "screenshot" && (
          <div className="sponsor-badge">
            <span className="sponsor-text">Interface concept</span>
          </div>
        )}
      </div>
      <div className="project-details">
        <div className="project-header-row">
          <Heading className="project-name">{p.name}</Heading>
          <div className="project-link-icons">
            {p.live ? (
              <External className="project-pill" href={p.live}>
                <Icon name="external" />
                Live
              </External>
            ) : (
              <span
                className="project-pill unavailable"
                title="Demo link will be added"
              >
                Live <Icon name="lock" />
              </span>
            )}
            {p.github ? (
              <External className="project-pill" href={p.github}>
                <Icon name="github" />
                GitHub
              </External>
            ) : (
              <span
                className="project-pill unavailable"
                title="Repository link will be added"
              >
                <Icon name="github" />
              </span>
            )}
          </div>
        </div>
        <p className="project-desc">{p.description}</p>
        <span className="project-tech-label">Tech Stack:</span>
        <div className="project-tech">
          {p.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <button
          className="project-expand"
          aria-expanded={open}
          aria-controls={"details-" + p.id}
          onClick={() => setOpen(!open)}
        >
          Details{" "}
          <Icon name="chevron" className={open ? "rotated" : ""} />
        </button>
        <ul className="engineering-details" id={"details-" + p.id} hidden={!open}>
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
      </div>
    </article>
  );
}
export default function Projects({ all = false }: { all?: boolean }) {
  return (
    <section className="project-section">
      <Title level={all ? 1 : 2}>Projects</Title>
      {all && <p className="project-desc">Projects by Yuvraj Satyapal, a Software Engineer and Full Stack Developer in Delhi, India. Other projects include InsightSpend. I’m currently building MindMora.</p>}
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} headingLevel={all ? 2 : 3} />
      ))}
      {!all && (
        <div className="view-all-projects right-side">
          <Link className="view-all-btn" to="/projects">
            View All Projects
            <Icon name="right" />
          </Link>
        </div>
      )}
    </section>
  );
}
