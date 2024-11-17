import { Gender, Level } from "@prisma/client";

export interface Player {
  id: string;
  name: string;
  email?: string | null;
  age?: number | null;
  phone?: string | null;
  gender: Gender;
  level: Level;
}
