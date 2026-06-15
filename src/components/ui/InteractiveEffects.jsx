import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SELECTOR = [
  ".section-panel",
  ".problem-card",
  ".glass-card",
  ".hero-image-card",
  ".hero-stat-card",
  ".contact-method",
  ".project-link",
  ".page-button",
  ".copy-button",
].join(", ");

export default function InteractiveEffects() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || coarsePointer) return undefined;

    const interactiveNodes = Array.from(document.querySelectorAll(SELECTOR));
    const cleanups = [];

    const updateSpotlight = (event) => {
      document.documentElement.style.setProperty("--bg-spotlight-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--bg-spotlight-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", updateSpotlight, { passive: true });

    interactiveNodes.forEach((node) => {
      let frame = 0;

      const update = (event) => {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;
        const rotateY = (px - 0.5) * 4;
        const rotateX = (0.5 - py) * 3.5;
        const shiftX = (px - 0.5) * 4;
        const shiftY = (py - 0.5) * 4;

        cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() => {
          node.style.setProperty("--cursor-x", `${x}px`);
          node.style.setProperty("--cursor-y", `${y}px`);
          node.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
          node.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
          node.style.setProperty("--mag-x", `${shiftX.toFixed(2)}px`);
          node.style.setProperty("--mag-y", `${shiftY.toFixed(2)}px`);
          node.classList.add("cursor-active");
        });
      };

      const leave = () => {
        cancelAnimationFrame(frame);
        node.style.setProperty("--tilt-x", "0deg");
        node.style.setProperty("--tilt-y", "0deg");
        node.style.setProperty("--mag-x", "0px");
        node.style.setProperty("--mag-y", "0px");
        node.classList.remove("cursor-active");
      };

      node.addEventListener("pointermove", update);
      node.addEventListener("pointerenter", update);
      node.addEventListener("pointerleave", leave);

      cleanups.push(() => {
        cancelAnimationFrame(frame);
        node.removeEventListener("pointermove", update);
        node.removeEventListener("pointerenter", update);
        node.removeEventListener("pointerleave", leave);
      });
    });

    return () => {
      window.removeEventListener("pointermove", updateSpotlight);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [location.pathname]);

  return null;
}
