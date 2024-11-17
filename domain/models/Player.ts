export enum Gender {
  Varonil = "Varonil",
  Femenil = "Femenil",
  Indefinido = "Indefinido",
}

export enum Level {
  Quinta = "Quinta",
  Cuarta = "Cuarta",
  Tercera = "Tercera",
  Segunda = "Segunda",
  Primera = "Primera",
}

export interface Player {
  id: string;
  name: string;
  email?: string | null;
  age?: number | null;
  phone?: string | null;
  gender?: Gender | null;
  level?: Level | null;
}
