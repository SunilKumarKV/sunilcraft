import React, { useState } from "react";
import "../styles/CertificateGallery.css";

const certificates = [
  {
    id: 1,
    title: "Achievement",
    img: "/assets/certificates/MOD.png",
    issuer: "HIMESH FOODS PVT .LTD",
    date: "Aug 2022",
    description:
      "It gives me immense pleasure to announce that we at MOD did our highest ever sales of 8.51C for the month July 2022.",
  },
  {
    id: 2,
    title: "SUPPORT START OF THE MONTH",
    img: "/assets/certificates/RRL oct-2022.png",
    issuer: "Reliance Retail Limited",
    date: "Oct 2022",
    description: "",
  },
  {
    id: 3,
    title: "BEST SUPPORT PERSON",
    img: "/assets/certificates/RRL april-2024.png",
    issuer: "Reliance Retail Limited",
    date: "April 2024",
    description: "",
  },
  {
    id: 4,
    title: "BEST SUPPORT PERSON",
    img: "/assets/certificates/RRL feb-2025.png",
    issuer: "Reliance Retail Limited",
    date: "Feb 2025",
    description: "",
  },
];

export default function CertificateGallery() {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <div className="certificate-gallery">
      <h2>Certificates & Rewards</h2>
      <div className="cert-grid">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="cert-card"
            onClick={() => setSelectedCert(cert)}
          >
            <img src={cert.img} alt={cert.title} />
            <div className="cert-info">
              <h3>{cert.title}</h3>
              <p>
                {cert.issuer} — {cert.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedCert && (
        <div className="modal" onClick={() => setSelectedCert(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setSelectedCert(null)}>
              &times;
            </span>
            <img src={selectedCert.img} alt={selectedCert.title} />
            <div className="modal-text">
              <h3>{selectedCert.title}</h3>
              <p>
                <strong>Issued by:</strong> {selectedCert.issuer}
              </p>
              <p>
                <strong>Date:</strong> {selectedCert.date}
              </p>
              <p>{selectedCert.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
