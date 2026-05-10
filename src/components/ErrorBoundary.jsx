import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("SunilCraft error boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="state-page">
          <h1>Something went wrong</h1>
          <p>Please refresh the page or go back to home.</p>
          <a href="/" className="hero-button">Back to Home</a>
        </main>
      );
    }
    return this.props.children;
  }
}
