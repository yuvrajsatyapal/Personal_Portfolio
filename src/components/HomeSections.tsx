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
  return (
    <section className="hero-section">
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
                  <span className="heart" title="Thanks for stopping by">
                    <Icon name="heart" />
                  </span>
                </h1>
              </div>
              <p className="hero-section-profile-username">@{profile.handle}</p>
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
              <Icon name="linkedin" />
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
            <span className="discord-join-btn">Profile ↗</span>
          </External>
        </div>
        <div className="contact-me">
          {profile.email ? (
            <External className="contact-btn" href={"mailto:" + profile.email}>
              <Icon name="email" />
              Email Me
            </External>
          ) : (
            <button
              disabled
              className="contact-btn"
              title="Public email will be added"
            >
              <Icon name="email" />
              Email Me
            </button>
          )}
          <span className="contact-separator">|</span>
          {socials.map((s) =>
            s.url ? (
              <External
                key={s.name}
                className="contact-btn"
                href={s.url}
                title={s.name}
              >
                <Icon name={s.icon} />
                <span className="sr-only">{s.name}</span>
              </External>
            ) : (
              <button
                key={s.name}
                disabled
                className="contact-btn"
                title={s.name + " link will be added"}
                aria-label={s.name + " link coming soon"}
              >
                <Icon name={s.icon} />
              </button>
            ),
          )}
          <Link className="contact-btn" to="/resume" title="Resume">
            <Icon name="resume" />
            <span className="sr-only">Resume</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
export function Skills() {
  return (
    <section className="skill-section">
      <Title>My Skills</Title>
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
                  <span className="skill-icon" style={{ color: s.color }}>
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
    <section className="experience-section">
      <Title>Work Experience</Title>
      <div className="exp-timeline-container">
        <div className="exp-timeline-line" />
        {experience.map((e, i) => (
          <div className="exp-timeline-item" key={e.company}>
            <span className={"exp-timeline-dot " + e.status} />
            <div className="exp-card">
              <div className="exp-header">
                <div className="exp-header-left">
                  <div className="exp-logo initials-logo">{e.initials}</div>
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
    <section className="standard-container education-section">
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
