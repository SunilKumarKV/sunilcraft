import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSun, FaMoon } from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleShowNavbar = () => setIsOpen(!isOpen);
  const handleCloseNavbar = () => setIsOpen(false);

  const handleNavClick = (id) => {
    handleCloseNavbar();

    if (id === "Rewards") {
      navigate("/rewards");
    } else {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100); // wait for homepage to load
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header>
      <nav className="navbar">
        <div className="container">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">S</div>
            <div className="logo-text">SunilCraft</div>
          </div>

          {/* Theme Toggle + Hamburger */}
          <div className="right-controls">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            <div
              className={`menu-icon ${isOpen ? "open" : ""}`}
              onClick={handleShowNavbar}
              aria-label="Toggle menu"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") handleShowNavbar();
              }}
            >
              <GiHamburgerMenu />
            </div>
          </div>

          {/* Navigation Menu */}
          <div className={`menu-list ${isOpen ? "active" : ""}`}>
            <ul>
              {[
                "home",
                "about",
                "projects",
                "skills",
                "Rewards",
                "contact",
              ].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => handleNavClick(id)}
                    className="menu-item"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      font: "inherit",
                    }}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
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
