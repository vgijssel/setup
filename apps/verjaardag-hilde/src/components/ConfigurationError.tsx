interface ConfigurationErrorProps {
  missingUrl: boolean;
  missingToken: boolean;
}

/**
 * Fallback UI displayed when environment configuration is missing.
 *
 * Helps developers identify configuration issues during setup.
 */
export function ConfigurationError({
  missingUrl,
  missingToken,
}: ConfigurationErrorProps) {
  return (
    <div className="error-container">
      <div className="error-card">
        <h1>Configuratiefout</h1>
        <p className="error-message">
          De Home Assistant configuratie ontbreekt.
        </p>
        <ul className="error-list">
          {missingUrl && (
            <li>
              <code>VITE_HA_URL</code> is niet geconfigureerd
            </li>
          )}
          {missingToken && (
            <li>
              <code>VITE_HA_TOKEN</code> is niet geconfigureerd
            </li>
          )}
        </ul>
        <p className="error-details">
          Voeg deze variabelen toe aan het <code>.env</code> bestand:
        </p>
        <pre className="error-code">
          {`VITE_HA_URL=http://192.168.1.32:8123
VITE_HA_TOKEN=your_long_lived_access_token`}
        </pre>
      </div>
    </div>
  );
}
