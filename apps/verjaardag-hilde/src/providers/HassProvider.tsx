import { HassConnect } from "@hakit/core";
import { ReactNode, useState, useCallback } from "react";
import { ConnectionError } from "../components/ConnectionError";
import { ConfigurationError } from "../components/ConfigurationError";

interface HassProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the application with Home Assistant connection.
 *
 * Uses @hakit/core's HassConnect which handles browser-based OAuth authentication.
 * The first time a user visits, they'll be redirected to HA login.
 * After authentication, the token is stored in browser storage.
 *
 * Environment variables:
 * - VITE_HA_URL: The Home Assistant URL (required)
 */
export function HassProvider({ children }: HassProviderProps) {
  const [connectionError, setConnectionError] = useState<Error | null>(null);

  const haUrl = import.meta.env.VITE_HA_URL;

  const handleReady = useCallback(() => {
    console.log("Home Assistant connection ready");
    setConnectionError(null);
  }, []);

  const handleRetry = useCallback(() => {
    setConnectionError(null);
    window.location.reload();
  }, []);

  // Configuration validation
  if (!haUrl) {
    return <ConfigurationError missingUrl={true} missingToken={false} />;
  }

  // Connection error state
  if (connectionError) {
    return <ConnectionError error={connectionError} onRetry={handleRetry} />;
  }

  return (
    <HassConnect
      hassUrl={haUrl}
      onReady={handleReady}
      loading={
        <div className="app">
          <div className="screen-container">
            <div className="loading">
              <h2>Laden...</h2>
              <p>Verbinden met Home Assistant...</p>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </HassConnect>
  );
}
