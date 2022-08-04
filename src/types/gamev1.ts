import { TypeAccusation } from "./game";

// Campaing
export interface TypeCampaingV1 {
  id: number
  name: string
  urlImage: string
  map: number[]
  narraitve: string
  weapons: Weapon[]
  objects: Object[]
}

export interface Weapon {
  id: number
  name: string
  clue: string
}

export interface Object {
  id: number
  name: string
  type?: string | null
  clue: string
}

// Game
export interface TypeGameV1Session {
  id: number;
  id_campaing: number;
  player_count: number;
  is_accusing?: boolean;
  accusations: TypeAccusation[];
  players: TypePlayerV1[]; 
  map: TypeMap;
}

export interface TypePlayerV1 {
  id: number;
  name: string;
  points: number;
  is_assassin?: boolean;
  color: string;
  hash: string;
  isTurn?: boolean;
  position?: number[] | null;
  objects?: Object[];
  weapons?: Weapon[];
}

export interface TypeMap {
  yAxis: number;
  xAxis: number;
  cells: TypeCell[];
}

export interface TypeCell {
  x: number;
  y: number;
  clue?: string;
  isHiddenBody?: boolean;
  isHiddenWeapon?: boolean;
  isHiddenObject?: boolean;
  players?: TypePlayerV1[];
}
