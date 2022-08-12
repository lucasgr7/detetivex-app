import { TypePlayerAttribute } from "./api";
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
  assassin_index: number;
  id_campaing: number;
  player_count: number;
  is_accusing?: boolean;
  players: TypePlayerV1[]; 
  map: TypeMap;
  events?: TypeEvent[];
  syncs?: string[];
  playerTurn: number;
  hasAssassinHideTheBody?: boolean;
}

export interface TypeEvent{
  id: number;
  type: string;
  data: any;
}

export interface TypePlayerV1 {
  name: string;
  points: number;
  personality: TypePlayerAttribute[];
  is_assassin?: boolean;
  color: string;
  hash: string;
  isTurn?: boolean;
  position?: any[] | null;
  objects?: Object[];
  weapons?: Weapon[];
}

export interface TypeMap {
  yAxis: number;
  xAxis: number;
  cells?: TypeCell[];
}

export interface TypeCell {
  x: number;
  y: number;
  clue?: string;
  isHiddenBody?: boolean;
  isHiddenWeapon?: boolean;
  isHiddenObject?: boolean;
  players?: TypePlayerV1[];
  hasTrap?: boolean;
}
