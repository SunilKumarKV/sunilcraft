import React, { Suspense, lazy } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Seo from "./components/Seo";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import AnimatedBackground from "./components/ui/AnimatedBackground";
import InteractiveEffects from "./components/ui/InteractiveEffects";
import "./App.css";

const Hero = lazy(() => import("./components/HeroSection"));
const About = lazy(() => import("./components/AboutPage"));
const ProjectsPage = lazy(() => import("./components/ProjectsPage"));
const RewardsPage = lazy(() => import("./components/CertificateGallery"));
const Contact = lazy(() => import("./components/ContactSection"));
const NotFound = lazy(() => import("./components/NotFound"));
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));
const ProblemsHome = lazy(() => import("./problems/ProblemsHome"));
const ProblemDetailPage = lazy(() => import("./problems/ProblemDetailPage"));
const CodebasePage = lazy(() => import("./codebase/CodebasePage"));
const CodebaseDetailPage = lazy(() => import("./codebase/CodebaseDetailPage"));
const DashboardPage = lazy(() => import("./dashboard/DashboardPage"));
const JourneyPage = lazy(() => import("./journey/JourneyPage"));
const AchievementsPage = lazy(() => import("./achievements/AchievementsPage"));

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

function AppRoutes() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.992 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.996 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="route-scene"
        data-route-root={location.pathname.split("/")[1] || "home"}
      >
        <Routes location={location}>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/problems" element={<ProblemsHome />} />
          <Route path="/problems/:platform/:slug" element={<ProblemDetailPage />} />
          <Route path="/codebase" element={<CodebasePage />} />
          <Route path="/codebase/:platform/:slug" element={<CodebaseDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  return (
    <ErrorBoundary>
      <div className="app-frame">
        <Seo />
        <ScrollToTop />
        <AnimatedBackground />
        <InteractiveEffects />
        <div className="app-layer">
          <Navbar />
          <Suspense fallback={<RouteFallback />}>
            <AppRoutes />
          </Suspense>
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
