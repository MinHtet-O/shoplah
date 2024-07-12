import React from "react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  handleGoToHomePage: () => void; // Adding the handleGoToHomePage prop
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  handleGoToHomePage,
}) => {
  return (
    <section className="section">
      <div className="container">
        <div className="notification is-light">
          <h2 className="title is-4">
            <span> Oops! Something went wrong.</span>
          </h2>
          <p className="subtitle is-6 mt-4">
            We encountered an unexpected error. Please try again.
          </p>
          <pre
            className="has-background-light p-3"
            style={{ overflowX: "auto" }}
          >
            {error.message}
          </pre>
          <div className="buttons mt-4">
            <button
              className="button is-text is-light"
              onClick={resetErrorBoundary}
            >
              <span className="icon is-small">
                <i className="fas fa-redo"></i>
              </span>
              <span>Try Again</span>
            </button>
            <button
              className="button is-text is-light"
              onClick={handleGoToHomePage}
            >
              <span className="icon is-small">
                <i className="fas fa-house"></i>
              </span>
              <span>Go to Home Page</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorFallback;
