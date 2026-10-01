import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { profile, socials } from "../data/portfolio";
import Icon from "./Icon";
export function External({
  href,
  children,
  className,
  title,
  describedBy,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
  describedBy?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      title={title}
      aria-describedby={describedBy}
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
export { default as Navbar } from "./Header";
export function Footer() {
  const quoteWords = profile.quote.trim().split(/\s+/);
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-quote">
          <span className="sr-only">“{profile.quote}”</span>
          <span aria-hidden="true">
            “
            {quoteWords.map((word, index) => (
              <span key={index}>
                {index > 0 && " "}
                <span
                  className="footer-quote-word"
                  style={{
                    animationDelay: `${index * 2}s`,
                    animationDuration: `${quoteWords.length * 2}s`,
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
            ”
          </span>
        </p>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Yuvraj Satyapal.
          </p>
          <span className="footer-visitors">
            <Clock />
          </span>
        </div>
      </div>
    </footer>
  );
}
export function Contact() {
  const [tooltipsDismissed, setTooltipsDismissed] = useState(false);
  return (
    <section id="contact" className="contact-me-section">
      <div className="contact-me-card">
        <h2 className="contact-me-title">Let's Connect</h2>
        <p className="contact-me-description">
          You can reach me through any of the platforms below.
        </p>
        <div
          className={
            "contact-links" + (tooltipsDismissed ? " tooltips-dismissed" : "")
          }
          onKeyDown={(event) => {
            if (event.key === "Escape") setTooltipsDismissed(true);
          }}
          onFocusCapture={() => setTooltipsDismissed(false)}
          onMouseEnter={() => setTooltipsDismissed(false)}
          onMouseLeave={() => setTooltipsDismissed(false)}
        >
          {socials
            .filter((s) => s.url)
            .map((s) => (
              <span className="contact-tooltip-wrap" key={s.name}>
                <External
                  href={s.url!}
                  className="contact-link-btn"
                  describedBy={`connect-tooltip-${s.icon}`}
                >
                  <Icon name={s.icon} colored />
                  {s.name}
                </External>
                <span
                  className="contact-tooltip"
                  role="tooltip"
                  id={`connect-tooltip-${s.icon}`}
                >
                  <strong>{s.name}</strong>
                  <span>@{s.handle}</span>
                </span>
              </span>
            ))}
          {profile.email && (
            <span className="contact-tooltip-wrap">
              <External
                href={"mailto:" + profile.email}
                className="contact-link-btn"
                describedBy="connect-tooltip-email"
              >
                <Icon name="email" colored />
                Email
              </External>
              <span
                className="contact-tooltip"
                role="tooltip"
                id="connect-tooltip-email"
              >
                <strong>Gmail</strong>
                <span>{profile.email}</span>
              </span>
            </span>
          )}
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
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (
      !hash &&
      typeof window.scrollTo === "function" &&
      !navigator.userAgent.includes("jsdom")
    ) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    if (hash)
      document
        .getElementById(decodeURIComponent(hash.slice(1)))
        ?.scrollIntoView?.({ block: "start" });
    document.title = profile.name + " | " + profile.role;
  }, [pathname, hash]);
  return null;
}
