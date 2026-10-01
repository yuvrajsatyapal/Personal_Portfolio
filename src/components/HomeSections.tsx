import { useState } from "react";
import { Link } from "react-router-dom";
import {
  profile,
  socials,
  skills,
  tools,
  experience,
  education,
  achievements,
} from "../data/portfolio";
import { Clock, External, Title } from "./Shared";
import Icon from "./Icon";
export function Hero() {
  const [tooltipsDismissed, setTooltipsDismissed] = useState(false);
  return (
    <section id="about" className="hero-section">
      <div className="hero-section-banner-outer">
        <div className="hero-section-profile">
          <div className="hero-section-avatar-wrapper">
            <div className="hero-section-avatar">
              <img
                src={profile.photo || "/images/profile-placeholder.svg"}
                alt="Profile photo"
              />
            </div>
          </div>
          <div className="hero-section-profile-info">
            <div className="hero-section-profile-main">
              <div className="hero-section-profile-name-row">
                <h1 className="hero-section-profile-name">
                  {profile.name}
                </h1>
              </div>
              <p className="hero-section-profile-username">
                <External href={profile.handleUrl}>@{profile.handle}</External>
              </p>
              <p className="hero-section-profile-status-row">
                <Link to="/projects">{profile.status}</Link>
                <span className="tiny-status-dot" />
              </p>
              <div className="hero-section-profile-meta-row">
                <span className="hero-section-profile-meta">
                  <Icon name="location" />
                  {profile.location}
                </span>
                <span className="hero-section-profile-dot">•</span>
                <span className="hero-section-profile-meta">
                  <Icon name="clock" />
                  <Clock compact />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container about-me">
        <ul className="about-bio">
          {profile.bioLines.map((line, i) => (
            <li className="about-bio-item" key={i}>
              <span className="about-bio-marker" />
              <span>
                {line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
                  part.startsWith("**") ? (
                    <strong key={j} className="bio-highlight">
                      {part.slice(2, -2)}
                    </strong>
                  ) : (
                    part
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="hero-divider" />
        <div className="community-links">
          <External href={socials[0].url!} className="twitter-card">
            <span className="twitter-card-left">
              <Icon name="linkedin" colored />
            </span>
            <span className="twitter-card-middle">
              <span className="twitter-name">{profile.name}</span>
              <span className="twitter-handle">{profile.role}</span>
            </span>
            <span className="twitter-follow-btn">Connect</span>
          </External>
          <External href={socials[2].url!} className="discord-invite">
            <span className="discord-invite-left leetcode-logo">
              <Icon name="leetcode" colored />
            </span>
            <span className="discord-invite-middle">
              <span className="discord-server-name">LeetCode</span>
              <span className="discord-server-stats">
                <span className="discord-online-dot" />@
                {achievements.leetcodeUsername}
              </span>
            </span>
            <span className="discord-join-btn">
              Profile
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </span>
          </External>
        </div>
        <div
          className={"contact-me" + (tooltipsDismissed ? " tooltips-dismissed" : "")}
          onKeyDown={event => { if (event.key === "Escape") setTooltipsDismissed(true); }}
          onFocusCapture={() => setTooltipsDismissed(false)}
          onMouseEnter={() => setTooltipsDismissed(false)}
          onMouseLeave={() => setTooltipsDismissed(false)}
        >
          {profile.email ? (
            <span className="contact-tooltip-wrap contact-tooltip-first">
              <External className="contact-btn" href={"mailto:" + profile.email} describedBy="contact-tooltip-email">
                <Icon name="email" colored />
                <span className="sr-only">Email</span>
              </External>
              <span className="contact-tooltip" role="tooltip" id="contact-tooltip-email">
                <strong>Gmail</strong><span>{profile.email}</span>
              </span>
            </span>
          ) : (
            <button
              disabled
              className="contact-btn"
              title="Public email will be added"
            >
              <Icon name="email" colored />
              <span className="sr-only">Email</span>
            </button>
          )}
          {socials.map((s) =>
            s.url ? (
              <span className="contact-tooltip-wrap" key={s.name}>
                <External className="contact-btn" href={s.url} describedBy={`contact-tooltip-${s.icon}`}>
                  <Icon name={s.icon} colored />
                  <span className="sr-only">{s.name}</span>
                </External>
                <span className="contact-tooltip" role="tooltip" id={`contact-tooltip-${s.icon}`}>
                  <strong>{s.name}</strong><span>@{s.handle}</span>
                </span>
              </span>
            ) : (
              <button
                key={s.name}
                disabled
                className="contact-btn"
                title={s.name + " link will be added"}
                aria-label={s.name + " link coming soon"}
              >
                <Icon name={s.icon} colored />
              </button>
            ),
          )}
          <span className="contact-tooltip-wrap">
            <Link className="contact-btn" to="/resume" aria-describedby="contact-tooltip-resume">
              <Icon name="resume" colored />
              <span className="sr-only">Resume</span>
            </Link>
            <span className="contact-tooltip" role="tooltip" id="contact-tooltip-resume">
              <strong>Resume</strong><span>{profile.name}</span>
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
export function Skills() {
  return (
    <section id="skills" className="skill-section">
      <Title>Tech Stack</Title>
      {[skills, tools].map((row, i) => (
        <div
          className="marquee-container"
          key={i}
          tabIndex={0}
          aria-label={
            i ? "Tools and cloud technologies" : "Languages and frameworks"
          }
        >
          <div className={"marquee" + (i ? " reverse" : "")}>
            {[0, 1, 2].map((copy) =>
              row.map((s) => (
                <span
                  key={copy + s.name}
                  className={"skill-pill" + (s.primary ? " primary-skill" : "")}
                  aria-hidden={copy > 0 ? "true" : undefined}
                >
                  <span className="skill-icon" data-icon={s.icon} style={{ color: s.color }}>
                    <Icon name={s.icon} />
                  </span>
                  <span className="skill-name">{s.name}</span>
                </span>
              )),
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
export function Experience() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  return (
    <section id="experience" className="experience-section">
      <Title>Experience</Title>
      <div className="exp-timeline-container">
        <div className="exp-timeline-line" />
        {experience.map((e, i) => (
          <div className="exp-timeline-item" key={e.company}>
            <span className={"exp-timeline-dot " + e.status} />
            <div className="exp-card">
              <div className="exp-header">
                <div className="exp-header-left">
                  {e.logo ? (
                    <div className="exp-logo company-logo">
                      <img src={e.logo} alt={`${e.company} logo`} />
                    </div>
                  ) : (
                    <div className="exp-logo initials-logo">{e.initials}</div>
                  )}
                  <div className="exp-company-info">
                    <div className="exp-company-row">
                      <h3 className="exp-company-name">{e.company}</h3>
                      <span className={"exp-status-badge " + e.status}>
                        <span className={"exp-status-dot " + e.status}>●</span>
                        Done
                      </span>
                    </div>
                    <span className="exp-role-text">
                      {e.role} · {e.location}
                    </span>
                  </div>
                </div>
                <div className="exp-header-right">
                  <span className="exp-meta">{e.dates}</span>
                  <button
                    className="exp-expand-btn"
                    aria-label={"Toggle details for " + e.company}
                    aria-expanded={!!expanded[i]}
                    aria-controls={"experience-" + i}
                    onClick={() =>
                      setExpanded({ ...expanded, [i]: !expanded[i] })
                    }
                  >
                    <Icon
                      className={
                        "exp-expand-icon" + (expanded[i] ? " open" : "")
                      }
                      name="chevron"
                    />
                  </button>
                </div>
              </div>
              <div
                className={"exp-details" + (expanded[i] ? " expanded" : "")}
                id={"experience-" + i}
                inert={!expanded[i]}
              >
                <ul className="exp-bullets">
                  {e.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function Education() {
  return (
    <section id="education" className="standard-container education-section">
      <Title>Education</Title>
      <div className="education-card">
        <span className="education-icon">
          <Icon name="education" />
        </span>
        <div>
          <h3>{education.degree}</h3>
          <p>{education.institute}</p>
          <div className="education-meta">
            <span>{education.dates}</span>
            <span>{education.grade}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
