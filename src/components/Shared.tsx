import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { profile, socials, site } from "../data/portfolio";
import Icon from "./Icon";
export function External({
  href,
  children,
  className,
  title,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      title={title}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
export function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="card-title">
      {children}
      {["top left", "top right", "bottom left", "bottom right"].map((c) => (
        <span key={c} className={"corner " + c} aria-hidden="true" />
      ))}
    </h2>
  );
}
export function Clock({ compact = false }: { compact?: boolean }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <time dateTime={time.toISOString()}>
      {time.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: compact,
      })}
      {compact ? "" : " IST"}
    </time>
  );
}
export function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-inner">
        <div className="navbar-links">
          {[
            ["/", "Home"],
            ["/projects", "Projects"],
            ["/resume", "Resume"],
            ["/analytics", "Analytics"],
            ["/support", "Support"],
          ].map(([path, label]) => (
            <NavLink
              end={path === "/"}
              key={path}
              to={path}
              className={({ isActive }) =>
                "navbar-link" + (isActive ? " navbar-link-active" : "")
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
        {site.repoUrl ? (
          <External
            href={site.repoUrl}
            className="navbar-star"
            title="Star this portfolio on GitHub"
          >
            <Icon name="star" />
          </External>
        ) : (
          <Link
            to="/projects"
            className="navbar-star"
            aria-label="Explore featured projects"
            title="Explore featured projects"
          >
            <Icon name="star" />
          </Link>
        )}
      </div>
    </nav>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-quote">“{profile.quote}”</p>
        <p className="footer-made">
          Designed & Made with <span aria-label="love">❤️</span>
        </p>
        <div className="footer-bottom">
          <span className="footer-copyright">
            {new Date().getFullYear()}. All rights reserved
          </span>
          <span className="footer-visitors">
            <Clock />
          </span>
        </div>
      </div>
    </footer>
  );
}
export function Contact() {
  return (
    <section className="contact-me-section">
      <div className="contact-me-card">
        <h2 className="contact-me-title">Let's Connect</h2>
        <p className="contact-me-description">
          Feel free to reach out through any of these platforms
        </p>
        <div className="contact-links">
          {socials
            .filter((s) => s.url)
            .map((s) => (
              <External key={s.name} href={s.url!} className="contact-link-btn">
                <Icon name={s.icon} />
                {s.name}
              </External>
            ))}
          {profile.email && (
            <External
              href={"mailto:" + profile.email}
              className="contact-link-btn"
            >
              <Icon name="email" />
              Email
            </External>
          )}
          <Link className="contact-link-btn" to="/resume">
            <Icon name="resume" />
            Resume
          </Link>
        </div>
      </div>
    </section>
  );
}
export function PageLinks({ next }: { next?: { to: string; label: string } }) {
  return (
    <div className="view-all-projects page-links">
      <Link className="view-all-btn" to="/">
        <Icon name="left" />
        Back to Home
      </Link>
      {next && (
        <Link className="view-all-btn" to={next.to}>
          {next.label}
          <Icon name="right" />
        </Link>
      )}
    </div>
  );
}
export function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (
      typeof window.scrollTo === "function" &&
      !navigator.userAgent.includes("jsdom")
    )
      window.scrollTo({ top: 0, behavior: "instant" });
    document.title = profile.name + " | " + profile.role;
  }, [pathname]);
  return null;
}
