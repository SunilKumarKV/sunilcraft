import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import "../styles/ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ message: "Please fill in all fields.", type: "error" });
      return;
    }

    emailjs
      .send(
        "service_nfl29v7", // Replace with your EmailJS service ID
        "templatey11143o", // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        "53BbXZraEZXEW23Oh" // Replace with your EmailJS public key
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
      });
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
    <section className="contact" id="contact">
      <div className="contact-header">
        <h2 className="contact-title">Let's Work Together</h2>
        <p className="contact-subtitle">
          Have a project or idea? I'd love to hear from you.
        </p>
      </div>

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
                placeholder={`Your ${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }`}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            ) : (
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            )}
          </motion.div>
        ))}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send Message
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
    </section>
  );
};

export default ContactSection;
