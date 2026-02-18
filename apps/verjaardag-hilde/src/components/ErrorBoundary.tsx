import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component to catch and display React errors gracefully.
 *
 * Wraps the application to prevent crashes from propagating and
 * provides a user-friendly error display with retry functionality.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-container">
          <div className="error-card">
            <h1>Oeps! Er ging iets mis</h1>
            <p className="error-message">
              Er is een fout opgetreden in de applicatie.
            </p>
            <p className="error-details">
              Probeer de pagina opnieuw te laden of neem contact op als het
              probleem aanhoudt.
            </p>

            <details className="error-technical">
              <summary>Technische details</summary>
              <pre>
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>

            <div className="error-actions">
              <button className="retry-button" onClick={this.handleRetry}>
                Opnieuw proberen
              </button>
              <button className="retry-button" onClick={this.handleReload}>
                Pagina herladen
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
