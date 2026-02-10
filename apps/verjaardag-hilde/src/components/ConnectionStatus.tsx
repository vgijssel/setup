import { useState, useEffect } from "react";
import { useHass } from "@hakit/core";

/**
 * Component that displays the Home Assistant connection status.
 *
 * Shows a small indicator in the corner when:
 * - Connection is being established (yellow)
 * - Connection is lost (red with reconnect option)
 * - Connection is healthy (green, auto-hides after 3s)
 */
export function ConnectionStatus() {
  const { getAllEntities } = useHass();
  const [status, setStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");
  const [isVisible, setIsVisible] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const entities = getAllEntities();
        if (entities && Object.keys(entities).length > 0) {
          setStatus("connected");
          setLastCheck(new Date());
          // Hide after 3 seconds when connected
          setTimeout(() => setIsVisible(false), 3000);
        } else {
          setStatus("disconnected");
          setIsVisible(true);
        }
      } catch {
        setStatus("disconnected");
        setIsVisible(true);
      }
    };

    // Initial check
    checkConnection();

    // Periodic check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [getAllEntities]);

  const handleRetry = () => {
    setStatus("checking");
    window.location.reload();
  };

  if (!isVisible && status === "connected") {
    return null;
  }

  return (
    <div className={`connection-status connection-status-${status}`}>
      <div className="connection-indicator" />
      <span className="connection-text">
        {status === "checking" && "Verbinding controleren..."}
        {status === "connected" && "Verbonden met Home Assistant"}
        {status === "disconnected" && (
          <>
            Verbinding verbroken
            <button className="reconnect-button" onClick={handleRetry}>
              Opnieuw verbinden
            </button>
          </>
        )}
      </span>
      {status === "connected" && (
        <span className="last-check">
          Laatste check: {lastCheck.toLocaleTimeString("nl-NL")}
        </span>
      )}
    </div>
  );
}
