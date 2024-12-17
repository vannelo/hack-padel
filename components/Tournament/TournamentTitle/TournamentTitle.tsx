"use client";

import React from "react";
import { formatDateInSpanish } from "@/utils/helpers";

interface TournamentManagementProps {
  tournamentName: string;
  tournamentDate: string;
}

const TournamentTitle: React.FC<TournamentManagementProps> = ({
  tournamentName,
  tournamentDate,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-3xl font-bold uppercase text-primary">
        {tournamentName}
      </h2>
      <h3 className="text-zinc-400">{formatDateInSpanish(tournamentDate)}</h3>
    </div>
  );
};

export default TournamentTitle;
