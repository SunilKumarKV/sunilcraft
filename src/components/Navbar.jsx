import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSun, FaMoon } from "react-icons/fa";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleShowNavbar = () => setIsOpen(!isOpen);
  const handleCloseNavbar = () => setIsOpen(false);

  return (
    <header>
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <div className="logo-icon">S</div>
            <div className="logo-text">SunilCraft</div>
          </div>

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

          <div className={`menu-list ${isOpen ? "active" : ""}`}>
            <ul>
              {["home", "about", "projects", "skills", "contact"].map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="menu-item"
                    onClick={handleCloseNavbar}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
