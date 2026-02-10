interface ConnectionErrorProps {
  error: Error;
  onRetry: () => void;
}

/**
 * Fallback UI displayed when Home Assistant connection fails.
 *
 * Provides user-friendly error message and retry capability.
 * Important for crash recovery - users can retry without restarting app.
 */
export function ConnectionError({ error, onRetry }: ConnectionErrorProps) {
  return (
    <div className="error-container">
      <div className="error-card">
        <h1>Verbindingsprobleem</h1>
        <p className="error-message">
          Kan geen verbinding maken met Home Assistant.
        </p>
        <p className="error-details">
          Controleer of Home Assistant bereikbaar is en probeer opnieuw.
        </p>
        <details className="error-technical">
          <summary>Technische details</summary>
          <pre>{error.message}</pre>
        </details>
        <button className="retry-button" onClick={onRetry}>
          Opnieuw proberen
        </button>
      </div>
    </div>
  );
}
