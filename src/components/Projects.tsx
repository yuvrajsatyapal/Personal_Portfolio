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
        <img
          src={p.image}
          style={p.imageKind === "logo" ? { objectFit: "contain" } : undefined}
          alt={
            p.name +
            (p.imageKind === "screenshot"
              ? " — website screenshot"
              : p.imageKind === "logo"
                ? " logo"
              : " — illustrative interface preview")
          }
          width={3390} height={1900}
          loading="lazy"
        />
        {p.video && (
          <video
            ref={video}
            className={"project-preview-video" + (playing ? " is-playing" : "")}
            src={previewLoaded ? p.video : undefined}
            poster={p.image}
            muted loop playsInline preload="none" aria-hidden="true"
            onTimeUpdate={event => {
              if (event.currentTarget.currentTime >= 15) event.currentTarget.currentTime = 0;
            }}
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
        {p.imageKind !== "screenshot" && p.imageKind !== "logo" && (
          <div className="sponsor-badge">
            <span className="sponsor-text">Interface concept</span>
          </div>
        )}
      </div>
      <div className="project-details">
        <div className="project-header-row">
          <div className="project-title-group">
            <Heading className="project-name">{p.name}</Heading>
            {p.underDevelopment && (
              <span className="project-development" tabIndex={0} aria-label="Under development" aria-describedby={`development-${p.id}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="6" width="20" height="8" rx="1" />
                  <path d="M17 14v7M7 14v7M17 3v3M7 3v3M10 14 2.3 6.3m11.7-.3 7.7 7.7M8 6l8 8" />
                </svg>
                <span className="project-development-tooltip" id={`development-${p.id}`} role="tooltip">
                  <span>Functionality might not work properly</span>
                  <span>Currently Building This Project, So its Under Development</span>
                </span>
              </span>
            )}
          </div>
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
        {p.tech.length > 0 && <>
        <span className="project-tech-label">Tech Stack:</span>
        <div className="project-tech">
          {p.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        </>}
        {p.highlights.length > 0 && <>
        <button
          className="project-expand"
          aria-expanded={open}
          aria-controls={"details-" + p.id}
          onClick={() => setOpen(!open)}
        >
          Details{" "}
          <Icon name="chevron" className={open ? "rotated" : ""} />
        </button>
        {open && (
          <ul className="engineering-details" id={"details-" + p.id}>
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        </>}
      </div>
    </article>
  );
}
export default function Projects({ all = false }: { all?: boolean }) {
  return (
    <section className="project-section">
      <Title level={all ? 1 : 2}>Projects</Title>
      {(all ? projects : projects.slice(0, 4)).map((p) => (
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
