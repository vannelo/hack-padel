import { Tournament } from "@/domain/models/Tournament";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatCoupleName = (couple: any) => {
  return `${couple.player1.name} / ${couple.player2.name}`;
};

export const calculateTotalScore = (
  tournament: Tournament,
  coupleId: string,
): number => {
  let totalScore = 0;
  tournament.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (match.couple1Id === coupleId) {
        totalScore += match.couple1Score;
      } else if (match.couple2Id === coupleId) {
        totalScore += match.couple2Score;
      }
    });
  });
  return totalScore;
};

export const formatDateInSpanish = (date: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("es-ES", options);
  const formattedDate = formatter.format(new Date(date));

  return formattedDate.charAt(0).toLowerCase() + formattedDate.slice(1);
};

export const createTournamentSSEUrl = (tournamentId: string) => {
  return `/api/tournaments/${tournamentId}/sse`;
};
