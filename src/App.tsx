import { useEffect, useState } from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Navbar,
  Footer,
  Contact,
  ScrollReset,
} from "./components/Shared";
import {
  Hero,
  Skills,
  Experience,
  Education,
} from "./components/HomeSections";
import Projects from "./components/Projects";
import ClickFeedback from "./components/ClickFeedback";
import SidePattern from "./components/SidePattern";
import SnoopyGutter from "./components/SnoopyGutter";
import Activity from "./components/Activity";
import Support from "./pages/Support";
import {
  Resume,
  Analytics,
  NotFound,
} from "./pages/Secondary";

function PersistentResume() {
  const active = useMatch("/resume") !== null;
  const [visited, setVisited] = useState(active);
  useEffect(() => {
    if (active) setVisited(true);
  }, [active]);

  // Retain the iframe's browsing context when other routes are displayed.
  return <div hidden={!active}>{(active || visited) && <Resume />}</div>;
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
    <>
      <SidePattern />
      <SnoopyGutter />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ClickFeedback />
      <Navbar />
      <ScrollReset />
      <main id="main">
        <Routes>
          <Route
            path="/"
            element={
              <div className="home-container">
                <Hero />
                <Skills />
                <Experience />
                <Education />
                <Projects />
                <Activity platform="github" />
                <Activity />
                <Analytics embedded />
                <Contact />
              </div>
            }
          />
          <Route
            path="/home"
            element={
              <div className="home-container">
                <Hero />
                <Skills />
                <Experience />
                <Education />
                <Projects />
                <Activity platform="github" />
                <Activity />
                <Analytics embedded />
                <Contact />
              </div>
            }
          />
          <Route
            path="/projects"
            element={
              <div className="projects-page secondary-page">
                <Projects all />
              </div>
            }
          />
          <Route path="/resume" element={null} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <PersistentResume />
      </main>
      <Footer />
    </>
    </QueryClientProvider>
  );
}
