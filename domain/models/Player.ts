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
  email?: string;
  age?: number;
  phone?: string;
  gender: Gender;
  level: Level;
}
