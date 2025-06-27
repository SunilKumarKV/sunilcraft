import { footer } from "framer-motion/client";
import { FaGithub, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="waves">
        <div className="wave" id="wave1"></div>
        <div className="wave" id="wave2"></div>
        <div className="wave" id="wave3"></div>
        <div className="wave" id="wave4"></div>
      </div>
      <div className="footer-bottom">
        <ul className="social-icon">
          <li className="social-icon__item">
            <a
              className="social-icon__link"
              href="https://github.com/SunilKumarKV"
              target="_blank"
            >
              <FaGithub />
            </a>
          </li>
          <li className="social-icon__item">
            <a
              className="social-icon__link"
              href="https://www.linkedin.com/in/sunilkumarkv44/"
              target="_blank"
            >
              <FaLinkedinIn />
            </a>
          </li>
          <li className="social-icon__item">
            <a
              className="social-icon__link"
              href="https://x.com/Sunil_KVB"
              target="_blank"
            >
              <FaTwitter />
            </a>
          </li>
          <li className="social-icon__item">
            <a
              className="social-icon__link"
              href="https://www.instagram.com/kaiser2op/"
              target="_blank"
            >
              <FaInstagram />
            </a>
          </li>
        </ul>
        <p className="footer-text">
          © {new Date().getFullYear()} Sunil Kumar K V
        </p>
      </div>
    </footer>
  );
}

export default Footer;
