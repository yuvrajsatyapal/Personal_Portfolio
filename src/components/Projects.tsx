import { useState } from "react";
import { Link } from "react-router-dom";
import { projects, type Project } from "../data/portfolio";
import { External, Title } from "./Shared";
import Icon from "./Icon";
export function ProjectCard({ project: p }: { project: Project }) {
  const [open, setOpen] = useState(false);
  return (
    <article
      id={"project-" + p.id}
      className={"project-card" + (p.featured ? " featured-project" : "")}
    >
      <div className="banner">
        <img
          src={p.image}
          alt={
            p.name +
            (p.imageKind === "screenshot"
              ? " — website screenshot"
              : " — illustrative interface preview")
          }
          loading="lazy"
        />
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
          <h3 className="project-name">{p.name}</h3>
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
        {open && (
          <ul className="engineering-details" id={"details-" + p.id}>
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
export default function Projects({ all = false }: { all?: boolean }) {
  return (
    <section className="project-section">
      <Title>Projects</Title>
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
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
