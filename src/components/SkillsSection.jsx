import React from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { motion } from "framer-motion";
import "../styles/SkillsSection.css";

const skillsData = {
  Frontend: [
    {
      name: "HTML5",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      level: 90,
      tooltip: "3+ years of experience",
    },
    {
      name: "CSS3",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      level: 85,
      tooltip: "Well-versed in Flexbox & Grid",
    },
    {
      name: "JavaScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      level: 80,
      tooltip: "Used in all major projects",
    },
    {
      name: "React",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      level: 75,
      tooltip: "SPA development experience",
    },
  ],
  Backend: [
    {
      name: "Node.js",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      level: 70,
      tooltip: "API and backend services",
    },
    {
      name: "Python",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      level: 80,
      tooltip: "Automation & data tasks",
    },
  ],
  Tools: [
    {
      name: "Git",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      level: 85,
      tooltip: "Version control and team workflows",
    },
    {
      name: "VS Code",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
      level: 90,
      tooltip: "Primary code editor",
    },
  ],
};

export default function Skills() {
  return (
    <section className="skills-section" id="skills">
      <h2 className="skills-title">My Skills</h2>
      {Object.entries(skillsData).map(([category, skills], i) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="category-title">{category}</h3>
          <div className="skills-grid">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="skill-card"
                data-tooltip-id={`tip-${skill.name}`}
                data-tooltip-content={skill.tooltip}
                aria-label={skill.tooltip}
              >
                <img src={skill.icon} alt={skill.name || "Skill icon"} />
                <p>{skill.name}</p>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <Tooltip id={`tip-${skill.name}`} place="top" />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </section>
  );
}
