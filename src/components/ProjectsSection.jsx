import React from "react";
import { motion } from "framer-motion";
import "../styles/ProjectsSection.css";
import img1 from "/assets/images/img.jpg";
import img2 from "/assets/images/project-3.jpg";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ProjectsSection = () => {
  const projectsData = [
    {
      title: "Personal Portfolio Website",
      image: img1,
      category: "Web Developer",
      description:
        "A personal portfolio website showcasing projects and skills. Developed a responsive layout using HTML, CSS, and JavaScript with added animations and SEO optimization.",
      link: "https://sunilkumarkv.github.io/Personal-Portfolio/",
    },
    {
      title: "E-Commerce Platform",
      image: img2,
      category: "Web Development",
      description:
        "Built a full-featured e-commerce site with React, including filters, cart, authentication, and payment integration. Scalable and component-driven.",
      link: "#",
    },
    {
      title: "E-Commerce Platform",
      image: img2,
      category: "Web Development",
      description:
        "Built a full-featured e-commerce site with React, including filters, cart, authentication, and payment integration. Scalable and component-driven.",
      link: "#",
    },
    {
      title: "⏱️ Countdown Timer with Dark/Light Mode & Animation",
      image:
        "	https://adoric.com/blog/wp-content/uploads/2020/07/creating-countdown-timer.jpg",
      category: "HTML5, CSS3, JavaScript",
      description:
        "A modern, responsive countdown timer built with HTML, CSS, and JavaScript. This project dynamically counts down to the next New Year with an easy-to-read UI, dark/light mode toggle, and smooth tick animations on the timer digits.",
      link: "https://sunilkumarkv.github.io/Countdown-Timer/",
    },
    {
      title: "🔍 SunilSearch – Google Search Clone",
      image:
        "https://www.google.com/chrome/static/images/dev-components/chrome-gallery-1-2x.webp",
      category: "HTML5, CSS3, JavaScript",
      description:
        "A polished and responsive replica of the Google Search homepage, enhanced with modern web features for an improved user experience. This project showcases front-end skills in layout design, accessibility, and browser APIs.",
      link: "https://sunilkumarkv.github.io/Google-Chrome-Page/",
    },
  ];

  return (
    <section className="projects" id="projects">
      <div className="projects-header">
        <h2 className="projects-title">Featured Projects</h2>
        <p className="projects-subtitle">
          A selection of recent works where creativity meets code. Explore some
          of my favorite projects.
        </p>
      </div>

      <div className="project-list">
        {projectsData.map((proj, idx) => (
          <motion.div
            className="project-card"
            key={idx}
            custom={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
          >
            <img src={proj.image} alt={proj.title} className="project-image" />
            <div className="project-info">
              <h3 className="project-title">{proj.title}</h3>
              <p className="project-category">{proj.category}</p>
              <p className="project-description">{proj.description}</p>
              <a href={proj.link} className="project-link" target="_blank">
                View Project →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
