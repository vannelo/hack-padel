import { Gender, Level } from "@prisma/client";

export interface ExtendedPlayer {
  id: string;
  name: string;
  email?: string | null;
  age?: number | null;
  phone?: string | null;
  gender?: Gender | null | undefined;
  level: Level;
  points?: number;
}
