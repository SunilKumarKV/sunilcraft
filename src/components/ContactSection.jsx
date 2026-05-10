import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
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
          disabled={isSending}
          whileHover={{ scale: isSending ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
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
    </section>
  );
};

export default ContactSection;
