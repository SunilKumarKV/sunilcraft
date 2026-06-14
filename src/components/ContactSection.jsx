import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaEnvelope, FaGithub, FaLinkedinIn, FaMapMarkerAlt } from "react-icons/fa";
import { profile } from "../data/profile";
import PageHeader from "./ui/PageHeader";
import SectionPanel from "./ui/SectionPanel";
import Badge from "./ui/Badge";
import "../styles/ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ message: "Please fill in all fields.", type: "error" });
      return;
    }

    if (!emailPattern.test(formData.email)) {
      setStatus({ message: "Please enter a valid email address.", type: "error" });
      return;
    }

    setIsSending(true);

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_nfl29v7",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "templatey11143o",
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "53BbXZraEZXEW23Oh"
      )
      .then(() => {
        setStatus({
          message: "Message sent successfully! 🚀",
          type: "success",
        });
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        setStatus({
          message: "Failed to send message. Please try again later.",
          type: "error",
        });
      })
      .finally(() => setIsSending(false));
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.4 },
    }),
  };

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Contact"
        title="Let’s build something useful and well-crafted"
        description="For frontend polish, dashboard architecture, portfolio systems, and production-ready React work, this page is designed to make the next step easy."
        align="left"
      />

      <SectionPanel
        eyebrow="Collaboration"
        title="Start a conversation"
        description="Reach out with a feature idea, UI cleanup request, portfolio upgrade, or product concept. I’m most helpful when the work needs both technical structure and visual refinement."
      >
        <div className="contact-layout">
          <div className="contact-column contact-summary">
            <div className="card-row">
              <Badge tone="accent">Frontend Systems</Badge>
              <Badge>React + Vite</Badge>
              <Badge tone="success">Available</Badge>
            </div>

            <div className="contact-intro">
              <h3>Best fit engagements</h3>
              <p>Developer portfolios, engineering dashboards, routing cleanup, mobile-first UI refinement, and production-ready frontend/full-stack features.</p>
            </div>

            <div className="contact-methods">
              <a href={`mailto:${profile.email}`} className="contact-method">
                <FaEnvelope />
                <div>
                  <strong>Email</strong>
                  <span>{profile.email}</span>
                </div>
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" className="contact-method">
                <FaGithub />
                <div>
                  <strong>GitHub</strong>
                  <span>See active builds and coding-journal sync</span>
                </div>
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-method">
                <FaLinkedinIn />
                <div>
                  <strong>LinkedIn</strong>
                  <span>Professional profile and collaboration context</span>
                </div>
              </a>
              <div className="contact-method static">
                <FaMapMarkerAlt />
                <div>
                  <strong>Location</strong>
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>

            <div className="contact-trust-grid">
              <article className="glass-card">
                <h3>UI/UX Cleanup</h3>
                <p>Turning cluttered flows into clearer, more premium product surfaces.</p>
              </article>
              <article className="glass-card">
                <h3>Developer Platforms</h3>
                <p>Problems, codebase, analytics, and synced engineering views built around live data.</p>
              </article>
              <article className="glass-card">
                <h3>Production Mindset</h3>
                <p>Routing, responsive layouts, build safety, and implementation detail all treated seriously.</p>
              </article>
            </div>
          </div>

          <div className="contact-column">
            <form onSubmit={handleSubmit} className="contact-form">
              {["name", "email", "message"].map((field, i) => (
                <motion.div
                  key={field}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={inputVariants}
                >
                  {field !== "message" ? (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <textarea
                      name="message"
                      placeholder="Tell me what you’re building, where it feels stuck, and what kind of help you need."
                      value={formData.message}
                      onChange={handleChange}
                      rows="7"
                      required
                    ></textarea>
                  )}
                </motion.div>
              ))}

              <motion.button
                type="submit"
                disabled={isSending}
                whileHover={{ scale: isSending ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isSending ? "Sending..." : "Send Message"}
              </motion.button>

              {status.message && (
                <motion.p
                  className={`form-status ${status.type}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {status.message}
                </motion.p>
              )}
            </form>
          </div>
        </div>
      </SectionPanel>
    </main>
  );
};

export default ContactSection;
