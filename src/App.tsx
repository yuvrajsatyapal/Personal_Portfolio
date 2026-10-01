import { Routes, Route } from "react-router-dom";
import {
  Navbar,
  Footer,
  Contact,
  ScrollReset,
  PageLinks,
} from "./components/Shared";
import {
  Hero,
  Skills,
  Experience,
  Education,
} from "./components/HomeSections";
import Projects from "./components/Projects";
import Activity from "./components/Activity";
import Support from "./pages/Support";
import {
  Resume,
  Analytics,
  Blogs,
  BlogPost,
  NotFound,
} from "./pages/Secondary";
export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
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
                <Contact />
              </div>
            }
          />
          <Route
            path="/projects"
            element={
              <div className="projects-page secondary-page">
                <Projects all />
                <div className="standard-container">
                  <PageLinks next={{ to: "/blogs", label: "View Blogs" }} />
                </div>
              </div>
            }
          />
          <Route path="/resume" element={<Resume />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/support" element={<Support />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
