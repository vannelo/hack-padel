import { NextRequest } from "next/server";
import { getTournamentById } from "@/app/actions/tournamentActions";

// Remove the edge runtime directive

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const tournamentId = params.id;

    // Verify tournament exists before starting stream
    const initialTournament = await getTournamentById(tournamentId);
    if (!initialTournament) {
      return new Response("Tournament not found", { status: 404 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let isStreamActive = true;

        const sendTournamentUpdate = async () => {
          if (!isStreamActive) return;

          try {
            const tournament = await getTournamentById(tournamentId);
            if (tournament) {
              const data = `data: ${JSON.stringify(tournament)}\n\n`;
              controller.enqueue(encoder.encode(data));
            } else {
              controller.close();
              isStreamActive = false;
            }
          } catch (error) {
            console.error("Error fetching tournament data:", error);
            if (isStreamActive) {
              controller.error(error);
              isStreamActive = false;
            }
          }
        };

        // Send initial data
        await sendTournamentUpdate();

        // Poll for updates every 5 seconds
        const intervalId = setInterval(sendTournamentUpdate, 5000);

        // Clean up on close
        request.signal.addEventListener("abort", () => {
          clearInterval(intervalId);
          isStreamActive = false;
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in SSE route:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
