import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/HeroSection";
import About from "./components/AboutSection";
import Projects from "./components/ProjectsSection";
import Skills from "./components/SkillsSection";
import RewardsPage from "./components/CertificateGallery";
import Contact from "./components/ContactSection";

// Problems pages
import ProblemsHome from "./problems/ProblemsHome";
import JavaScriptProblems from "./problems/javascript/JavaScriptProblems";
import ProblemLayout from "./problems/javascript/30Days/ProblemLayout";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Main portfolio routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/contact" element={<Contact />} />

        {/* Problems Section */}
        <Route path="/problems" element={<ProblemsHome />} />
        <Route path="/problems/javascript" element={<JavaScriptProblems />} />
        <Route path="/problems/javascript/30days" element={<ProblemLayout />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
