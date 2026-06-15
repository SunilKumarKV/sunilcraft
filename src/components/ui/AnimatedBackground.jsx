import React, { useContext, useMemo } from "react";
import { ThemeContext } from "../../context/theme";
import "../../styles/AnimatedBackground.css";

const codeSymbols = ["{}", "<>", "()", "[]", "λ", "git", "npm", "fn"];

function createItems(count, mapper) {
  return Array.from({ length: count }, (_, index) => mapper(index));
}

export default function AnimatedBackground() {
  const { theme } = useContext(ThemeContext);

  const stars = useMemo(
    () =>
      createItems(36, (index) => ({
        id: `star-${index}`,
        left: `${3 + (index * 2.7) % 94}%`,
        top: `${2 + (index * 7.9) % 90}%`,
        size: `${1.8 + (index % 4) * 1.15}px`,
        delay: `${(index % 9) * 0.85}s`,
        duration: `${5.5 + (index % 5) * 1.2}s`,
      })),
    []
  );

  const twinkles = useMemo(
    () =>
      createItems(20, (index) => ({
        id: `twinkle-${index}`,
        left: `${6 + (index * 4.4) % 88}%`,
        top: `${5 + (index * 9.1) % 84}%`,
        size: `${3 + (index % 3) * 1.5}px`,
        delay: `${(index % 7) * 0.7}s`,
        duration: `${4.8 + (index % 4) * 1.15}s`,
      })),
    []
  );

  const particles = useMemo(
    () =>
      createItems(18, (index) => ({
        id: `particle-${index}`,
        left: `${4 + (index * 5.2) % 92}%`,
        delay: `${(index % 8) * 1.1}s`,
        duration: `${22 + (index % 5) * 4.5}s`,
        scale: 0.75 + (index % 4) * 0.18,
      })),
    []
  );

  const symbols = useMemo(
    () =>
      createItems(14, (index) => ({
        id: `symbol-${index}`,
        symbol: codeSymbols[index % codeSymbols.length],
        left: `${5 + (index * 7.1) % 88}%`,
        top: `${8 + (index % 5) * 16}%`,
        delay: `${(index % 6) * 1.05}s`,
        duration: `${18 + (index % 4) * 3.6}s`,
      })),
    []
  );

  const lightParticles = useMemo(
    () =>
      createItems(16, (index) => ({
        id: `light-${index}`,
        left: `${5 + (index * 6.2) % 90}%`,
        top: `${7 + (index * 8.7) % 82}%`,
        delay: `${(index % 5) * 0.8}s`,
        duration: `${12 + (index % 4) * 2.2}s`,
        size: `${4 + (index % 3) * 2}px`,
      })),
    []
  );

  return (
    <div className={`animated-background ${theme}`} aria-hidden="true">
      {theme === "dark" ? (
        <>
          <div className="bg-galaxy bg-galaxy-a" />
          <div className="bg-galaxy bg-galaxy-b" />
          <div className="bg-galaxy bg-galaxy-c" />
          <div className="bg-dark-haze bg-dark-haze-a" />
          <div className="bg-dark-haze bg-dark-haze-b" />

          <div className="bg-stars">
            {stars.map((star) => (
              <span
                key={star.id}
                className="bg-star"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  animationDelay: star.delay,
                  animationDuration: star.duration,
                }}
              />
            ))}
          </div>

          <div className="bg-twinkles">
            {twinkles.map((star) => (
              <span
                key={star.id}
                className="bg-twinkle"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  animationDelay: star.delay,
                  animationDuration: star.duration,
                }}
              />
            ))}
          </div>

          <div className="bg-falling-particles">
            {particles.map((particle) => (
              <span
                key={particle.id}
                className="bg-falling-particle"
                style={{
                  left: particle.left,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                  transform: `scale(${particle.scale})`,
                }}
              />
            ))}
          </div>

          <div className="bg-shooting-stars">
            {createItems(3, (index) => (
              <span
                key={`shooting-${index}`}
                className="bg-shooting-star"
                style={{
                  top: `${14 + index * 16}%`,
                  animationDelay: `${index * 3.6}s`,
                }}
              />
            ))}
          </div>

          <div className="bg-code-field">
            {symbols.map((item) => (
              <span
                key={item.id}
                className="bg-code-symbol"
                style={{
                  left: item.left,
                  top: item.top,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                }}
              >
                {item.symbol}
              </span>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="bg-light-mesh bg-light-mesh-a" />
          <div className="bg-light-mesh bg-light-mesh-b" />
          <div className="bg-light-blob bg-light-blob-a" />
          <div className="bg-light-blob bg-light-blob-b" />
          <div className="bg-light-blob bg-light-blob-c" />
          <div className="bg-reflection bg-reflection-a" />
          <div className="bg-reflection bg-reflection-b" />
          <div className="bg-reflection bg-reflection-c" />
          <div className="bg-light-particles">
            {lightParticles.map((particle) => (
              <span
                key={particle.id}
                className="bg-light-particle"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: particle.size,
                  height: particle.size,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                }}
              />
            ))}
          </div>
          <div className="bg-falling-particles">
            {particles.slice(0, 8).map((particle) => (
              <span
                key={`light-fall-${particle.id}`}
                className="bg-falling-particle"
                style={{
                  left: particle.left,
                  animationDelay: particle.delay,
                  animationDuration: `${18 + Number.parseFloat(particle.duration)}s`,
                  transform: `scale(${particle.scale * 0.8})`,
                  opacity: 0.14,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
