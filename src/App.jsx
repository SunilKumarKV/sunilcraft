import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Seo from "./components/Seo";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

const Hero = lazy(() => import("./components/HeroSection"));
const About = lazy(() => import("./components/AboutSection"));
const ProjectsPage = lazy(() => import("./components/ProjectsPage"));
const Skills = lazy(() => import("./components/SkillsSection"));
const RewardsPage = lazy(() => import("./components/CertificateGallery"));
const Contact = lazy(() => import("./components/ContactSection"));
const NotFound = lazy(() => import("./components/NotFound"));
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));
const ProblemsHome = lazy(() => import("./problems/ProblemsHome"));
const ProblemDetailPage = lazy(() => import("./problems/ProblemDetailPage"));
const CodebasePage = lazy(() => import("./codebase/CodebasePage"));
const CodebaseDetailPage = lazy(() => import("./codebase/CodebaseDetailPage"));

function RouteFallback() {
  return (
    <main className="page-shell">
      <div className="page-header">
        <span className="section-eyebrow">Loading</span>
        <h1>Loading Page</h1>
        <p>Preparing the next SunilCraft view.</p>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Seo />
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/problems" element={<ProblemsHome />} />
            <Route path="/problems/:platform/:slug" element={<ProblemDetailPage />} />
            <Route path="/codebase" element={<CodebasePage />} />
            <Route path="/codebase/:platform/:slug" element={<CodebaseDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
