import React, { useContext, useMemo } from "react";
import { ThemeContext } from "../../context/theme";
import "../../styles/AnimatedBackground.css";

const codeSymbols = ["{}", "<>", "()", "[]", "λ"];

export default function AnimatedBackground() {
  const { theme } = useContext(ThemeContext);

  const items = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: index,
        symbol: codeSymbols[index % codeSymbols.length],
        left: `${8 + index * 8.4}%`,
        delay: `${(index % 5) * 1.35}s`,
        duration: `${13 + (index % 4) * 2.6}s`,
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        left: `${5 + index * 7.4}%`,
        top: `${8 + (index % 5) * 18}%`,
        delay: `${(index % 6) * 0.9}s`,
        duration: `${9 + (index % 4) * 1.8}s`,
      })),
    []
  );

  return (
    <div className={`animated-background ${theme}`} aria-hidden="true">
      {theme === "dark" ? (
        <>
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
