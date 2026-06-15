import React, { useContext, useMemo } from "react";
import { ThemeContext } from "../../context/theme";
import "../../styles/AnimatedBackground.css";

const codeSymbols = ["{}", "<>", "()", "[]", "λ", "git", "npm", "fn"];

export default function AnimatedBackground() {
  const { theme } = useContext(ThemeContext);

  const items = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        symbol: codeSymbols[index % codeSymbols.length],
        left: `${6 + index * 7.4}%`,
        top: `${4 + (index % 4) * 18}%`,
        delay: `${(index % 6) * 1.15}s`,
        duration: `${18 + (index % 4) * 3.2}s`,
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: `${5 + index * 7.4}%`,
        top: `${8 + (index % 5) * 18}%`,
        delay: `${(index % 6) * 0.9}s`,
        duration: `${10 + (index % 4) * 1.8}s`,
      })),
    []
  );

  return (
    <div className={`animated-background ${theme}`} aria-hidden="true">
      {theme === "dark" ? (
        <>
          <div className="bg-aurora bg-aurora-a" />
          <div className="bg-aurora bg-aurora-b" />
          <div className="bg-dark-glow bg-dark-glow-a" />
          <div className="bg-dark-glow bg-dark-glow-b" />
          <div className="bg-particles">
            {sparkles.map((sparkle) => (
              <span
                key={sparkle.id}
                className="bg-particle"
                style={{
                  left: sparkle.left,
                  top: sparkle.top,
                  animationDelay: sparkle.delay,
                  animationDuration: sparkle.duration,
                }}
              />
            ))}
          </div>
          <div className="bg-code-rain">
            {items.map((item) => (
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
          <div className="bg-reflection bg-reflection-a" />
          <div className="bg-reflection bg-reflection-b" />
          <div className="bg-light-blob bg-light-blob-a" />
          <div className="bg-light-blob bg-light-blob-b" />
          <div className="bg-light-blob bg-light-blob-c" />
          <div className="bg-particles light">
            {sparkles.map((sparkle) => (
              <span
                key={sparkle.id}
                className="bg-particle"
                style={{
                  left: sparkle.left,
                  top: sparkle.top,
                  animationDelay: sparkle.delay,
                  animationDuration: sparkle.duration,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
