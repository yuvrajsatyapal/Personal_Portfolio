import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiSun, FiMoon, FiArrowUpRight, FiX } from "react-icons/fi";
import { projects } from "../data/portfolio";
import "../header.css";

const destinations = [
  { label: "Home", detail: "Portfolio overview", to: "/" },
  { label: "About", detail: "About Yuvraj", to: "/#about" },
  { label: "Projects", detail: "All projects", to: "/projects" },
  { label: "Resume", detail: "Experience and qualifications", to: "/resume" },
  { label: "Analytics", detail: "Portfolio analytics", to: "/analytics" },
  { label: "Support", detail: "Support my work", to: "/support" },
  { label: "Tech Stack", detail: "Languages, frameworks and tools", to: "/#skills" },
  { label: "Experience", detail: "Internship experience", to: "/#experience" },
  { label: "Education", detail: "Degree and institute", to: "/#education" },
  { label: "Contact", detail: "Let's Connect", to: "/#contact" },
  ...projects.map(project => ({ label: project.name, detail: project.description, to: `/projects#project-${project.id}` })),
];

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
      onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }}>
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
          <button key={item.to} id={`search-result-${index}`} className="search-result" role="option" aria-selected={index === active} onMouseEnter={() => setActive(index)} onClick={() => select(item.to)}>
            <span><strong>{item.label}</strong><small>{item.detail}</small></span><FiArrowUpRight aria-hidden="true" />
          </button>
        ))}
      </div>
      {!results.length && <p className="search-empty" role="status">No matches. Try a page or project name.</p>}
      <div className="search-hints"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>Esc</kbd> Close</span></div>
    </dialog>
  );
}

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 50);
  const [light, setLight] = useState(() => document.documentElement.dataset.theme === "light");
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(open => !open); }
    }
    window.addEventListener("keydown", keydown);
    return () => { window.removeEventListener("keydown", keydown); };
  }, []);
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
            <button className="header-theme" aria-label={`Switch to ${light ? "dark" : "light"} theme`} onClick={() => { const next = !light; setLight(next); document.documentElement.dataset.theme = next ? "light" : "dark"; }}>{light ? <FiMoon aria-hidden="true" /> : <FiSun aria-hidden="true" />}</button>
          </div>
        </div>
      </nav>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}
