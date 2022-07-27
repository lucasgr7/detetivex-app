
export interface TypePlayerAttribute {
  id:  number;
  name: string;
}

export interface NarrativeChange {
  tag: string;
  values: string[];
}

export interface HasDeath {
  message: string;
}

export interface HasNoDeath {
  message: string;
}

export interface Results {
  hasDeath: HasDeath;
  hasNoDeath: HasNoDeath;
}

export interface Investigation {
  id: number;
  name: string;
  risk: number;
  results: Results;
}

export interface TypeCampaing {
  name: string;
  id: number;
  year: number;
  narrative: string;
  urlImage: string;
  narrative_changes: NarrativeChange[];
  suspects_actions: string[];
  reasons: string[];
  investigations: Investigation[];
}


export interface Player {
  hash: string;
  name: string;
  isKiller: boolean;
  alive: boolean;
  attributes: number[];
  reasons: number[];
  suspects_actions?: number;
  winner: boolean;
}

export interface Accusation {
  initiation__user__hash: string;
  accusated__user__hash: string;
  votes: boolean[];
  eliminated: boolean;
}

export interface Investigation {
  investigationId: number;
  players: string[];
  whoWasKilled: string;
}

export interface TypeGameSession {
  CampaingId: number;
  id: number;
  players: Player[];
  isAccusing: boolean;
  accusations: Accusation[];
  investigations: Investigation[];
}