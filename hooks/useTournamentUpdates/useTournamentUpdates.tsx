"use client";

import { useState, useEffect } from "react";
import { Tournament } from "@/domain/models/Tournament";

export function useTournamentUpdates(initialTournament: Tournament) {
  const [tournament, setTournament] = useState<Tournament>(initialTournament);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    let eventSource: EventSource | null = null;

    const connectSSE = () => {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource(`/api/tournaments/${tournament.id}/sse`, {
        withCredentials: true,
      });

      eventSource.onmessage = (event) => {
        try {
          const updatedTournament = JSON.parse(event.data);
          if (updatedTournament) {
            setTournament(updatedTournament);
            setError(false);
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error);
          setError(true);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        eventSource?.close();
        setError(true);

        // Retry connection after 5 seconds
        retryTimeout = setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [tournament.id]);

  return tournament;
}
