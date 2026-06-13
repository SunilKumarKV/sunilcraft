import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/HeroSection";
import About from "./components/AboutSection";
import Projects from "./components/ProjectsSection";
import Skills from "./components/SkillsSection";
import RewardsPage from "./components/CertificateGallery";
import Contact from "./components/ContactSection";
import NotFound from "./components/NotFound";
import ProjectDetail from "./components/ProjectDetail";
import Seo from "./components/Seo";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

import ProblemsHome from "./problems/ProblemsHome";
import JavaScriptProblems from "./problems/javascript/JavaScriptProblems";
import ProblemLayout from "./problems/javascript/30Days/ProblemLayout";
import TenDaysCode from "./problems/javascript/10DaysCode";
import JavaProblems from "./problems/java/JavaProblems";
import ReactProblems from "./problems/reactjs/ReactProblems";
import LeetCodeProblems from "./problems/leetcode/LeetCodeProblems";
import DsaRoadmap from "./problems/dsa/DsaRoadmap";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Seo />
        <ScrollToTop />
        <Navbar />
        <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/problems" element={<ProblemsHome />} />
        <Route path="/problems/javascript" element={<JavaScriptProblems />} />
        <Route path="/problems/javascript/30days" element={<ProblemLayout />} />
        <Route path="/problems/javascript/10days" element={<TenDaysCode />} />
        <Route path="/problems/java" element={<JavaProblems />} />
        <Route path="/problems/reactjs" element={<ReactProblems />} />
        <Route path="/problems/leetcode" element={<LeetCodeProblems />} />
        <Route path="/problems/dsa" element={<DsaRoadmap />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
