import { Couple } from "./Couple";

export interface Match {
  id: string;
  couple1: Couple;
  couple2: Couple;
  couple1Score?: number;
  couple2Score?: number;
}
