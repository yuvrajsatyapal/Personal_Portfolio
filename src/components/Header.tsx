import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { transitionTheme } from "../lib/theme-transition";
import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import { projects } from "../data/portfolio";
import "../header.css";

const destinations = [
  { label: "Home", detail: "Portfolio overview", to: "/", shortcut: "H" },
  { label: "Projects", detail: "All projects", to: "/projects", shortcut: "P" },
  { label: "Resume", detail: "Experience and qualifications", to: "/resume", shortcut: "R" },
  { label: "Analytics", detail: "Portfolio analytics", to: "/analytics", shortcut: "A" },
  { label: "Tech Stack", detail: "Languages, frameworks and tools", to: "/#skills", shortcut: "T" },
  { label: "Experience", detail: "Internship experience", to: "/#experience", shortcut: "W" },
  { label: "Education", detail: "Degree and institute", to: "/#education", shortcut: "E" },
  { label: "Contact", detail: "Let's Connect", to: "/#contact", shortcut: "C" },
  ...projects.map((project, index) => ({ label: project.name, detail: project.description, to: `/projects#project-${project.id}`, shortcut: String(index + 1) })),
];
function shortcutDestination(event: { key: string; code: string; shiftKey: boolean; metaKey: boolean; ctrlKey: boolean; altKey: boolean }) {
  if (!event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
  const key = event.code.startsWith("Digit") ? event.code.slice(5) : event.key.toUpperCase();
  return destinations.find(item => item.shortcut === key);
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = destinations.filter(item => `${item.label} ${item.detail}`.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    if (dialog.current?.showModal) dialog.current.showModal();
    else dialog.current?.setAttribute("open", "");
    input.current?.focus();
    return () => { previouslyFocused?.focus(); };
  }, []);
  useEffect(() => {
    document.getElementById(`search-result-${active}`)?.scrollIntoView?.({ block: "nearest" });
  }, [active]);
  function select(to: string) { onClose(); navigate(to); }
  return (
    <dialog ref={dialog} className="portfolio-search" aria-modal="true" aria-labelledby="search-title" onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose(); } }}
      onKeyDown={event => {
        if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
        if (!query.trim() && !event.nativeEvent.isComposing && !event.repeat) {
          const destination = shortcutDestination(event);
          if (destination) { event.preventDefault(); event.stopPropagation(); select(destination.to); }
        }
      }}>
      <h2 id="search-title" className="sr-only">Search portfolio</h2>
      <div className="search-field">
        <FiSearch aria-hidden="true" />
        <input ref={input} role="combobox" aria-label="Search pages, sections and projects" aria-expanded="true" aria-controls="search-results" aria-autocomplete="list" aria-activedescendant={results.length ? `search-result-${active}` : undefined}
          placeholder="Search pages, sections, projects…" value={query}
          onChange={event => { setQuery(event.target.value); setActive(0); }}
          onKeyDown={event => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setActive(index => results.length ? (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length : 0);
            }
            if (event.key === "Enter" && results[active]) { event.preventDefault(); select(results[active].to); }
          }} />
        <button className="search-close" aria-label="Close search" onClick={onClose}><FiX /></button>
      </div>
      <div className="search-results" id="search-results" role="listbox" aria-label="Search results">
        {results.map((item, index) => (
          <button key={item.to} id={`search-result-${index}`} className="search-result" role="option" aria-selected={index === active} aria-keyshortcuts={`Shift+${item.shortcut}`} onMouseEnter={() => setActive(index)} onClick={() => select(item.to)}>
            <span><strong>{item.label}</strong><small>{item.detail}</small></span><kbd className="search-result-shortcut">shift + {item.shortcut}</kbd>
          </button>
        ))}
      </div>
      {!results.length && <p className="search-empty" role="status">No matches. Try a page or project name.</p>}
      <div className="search-hints"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>Esc</kbd> Close</span></div>
    </dialog>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 50);
  const [light, setLight] = useState(() => document.documentElement.dataset.theme === "light");
  const toggleSound = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const sound = new Audio("/audio/theme-toggle.mp3");
    sound.volume = .3;
    sound.preload = "auto";
    toggleSound.current = sound;
    return () => { sound.pause(); toggleSound.current = null; };
  }, []);
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing || event.repeat) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(open => !open); return; }
      if (searchOpen || (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])"))) return;
      const destination = shortcutDestination(event);
      if (destination) { event.preventDefault(); navigate(destination.to); }
    }
    window.addEventListener("keydown", keydown);
    return () => { window.removeEventListener("keydown", keydown); };
  }, [navigate, searchOpen]);
  return (
    <>
      <nav className={"portfolio-header" + (scrolled ? " is-scrolled" : "")} aria-label="Main navigation">
        <div className="portfolio-header-inner">

          <div className="header-navigation">
            <NavLink to="/" end className="header-link header-home">Home</NavLink>
            <NavLink to="/projects" className="header-link">Projects</NavLink>
            <NavLink to="/resume" className="header-link">Resume</NavLink>
            <NavLink to="/analytics" className="header-link">Analytics</NavLink>

          </div>
          <div className="header-actions">
            <button className="header-search" aria-label="Search portfolio" aria-haspopup="dialog" aria-keyshortcuts="Meta+K Control+K" onClick={() => { setSearchOpen(true); }}><FiSearch aria-hidden="true" /><span className="header-shortcut" aria-hidden="true"><kbd>{isMac ? "⌘" : "Ctrl"}</kbd><kbd>K</kbd></span></button>
            <span className="header-divider" aria-hidden="true" />
            <button className="header-theme" data-click-feedback="off" title="Toggle theme" aria-label={`Switch to ${light ? "dark" : "light"} theme`} onClick={() => {
              try {
                if (toggleSound.current) {
                  toggleSound.current.currentTime = 0;
                  void toggleSound.current.play()?.catch(() => {});
                }
              } catch { /* Audio availability must not interrupt theme switching. */ }
              void transitionTheme(() => {
                const next = !light;
                flushSync(() => { setLight(next); document.documentElement.dataset.theme = next ? "light" : "dark"; });
              });
            }}>
              {/* Dark Side icon adapted from chanhdai.com (MIT); see the audio license notice. */}
              <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path className={"theme-dark-side" + (light ? "" : " is-dark")} d="M16 .5C7.4.5.5 7.4.5 16S7.4 31.5 16 31.5 31.5 24.6 31.5 16 24.6.5 16 .5zm0 28.1V3.4C23 3.4 28.6 9 28.6 16S23 28.6 16 28.6z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}
