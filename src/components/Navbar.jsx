import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/theme";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSun, FaMoon } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import LogoMark from "./branding/LogoMark";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleShowNavbar = () => setIsOpen(!isOpen);
  const handleCloseNavbar = () => setIsOpen(false);

  const isNavActive = (id) => {
    if (id === "Home") return location.pathname === "/";
    if (id === "Work") return location.pathname.startsWith("/projects");
    if (id === "Problems") return location.pathname.startsWith("/problems");
    if (id === "Codebase") return location.pathname.startsWith("/codebase");
    if (id === "Coding") return location.pathname.startsWith("/coding");
    if (id === "About") {
      return (
        location.pathname.startsWith("/about") ||
        location.pathname.startsWith("/rewards") ||
        location.pathname.startsWith("/dashboard") ||
        location.pathname.startsWith("/journey") ||
        location.pathname.startsWith("/achievements")
      );
    }
    if (id === "Contact") return location.pathname.startsWith("/contact");
    return false;
  };

  const handleNavClick = (id) => {
    handleCloseNavbar();

    if (id === "Home") {
      navigate("/");
    } else if (id === "Work") {
      navigate("/projects");
    } else if (id === "Problems") {
      navigate("/problems");
    } else if (id === "Codebase") {
      navigate("/codebase");
    } else if (id === "About") {
      navigate("/about");
    } else if (id === "Coding") {
      navigate("/coding");
    } else if (id === "Contact") {
      navigate("/contact");
    } else {
      navigate("/");
    }
  };

  return (
    <header>
      <nav className="navbar">
        <div className="container">
          {/* Logo */}
          <button className="logo" type="button" onClick={() => handleNavClick("Home")} aria-label="SunilCraft home">
            <LogoMark />
            <div className="logo-text">SunilCraft</div>
          </button>

          {/* Theme Toggle + Hamburger */}
          <div className="right-controls">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            <button
              type="button"
              className={`menu-icon ${isOpen ? "open" : ""}`}
              onClick={handleShowNavbar}
              aria-label="Toggle menu"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleShowNavbar();
              }}
            >
              <GiHamburgerMenu />
            </button>
          </div>

          {/* Navigation Menu */}
          <div className={`menu-list ${isOpen ? "active" : ""}`}>
            <ul>
              {[
                "Home",
                "Work",
                "Problems",
                "Codebase",
                "Coding",
                "About",
                "Contact",
              ].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => handleNavClick(id)}
                    className={`menu-item ${isNavActive(id) ? "active" : ""}`}
                    aria-current={isNavActive(id) ? "page" : undefined}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      font: "inherit",
                    }}
                  >
                    {id}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
