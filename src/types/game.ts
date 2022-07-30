import { TypeCampaing } from "./campaing"

export interface TypeGameSessionResponse {
  id: number
  id_campaign: number
  player_count: number
  is_accusing?: boolean
  accusations: TypeAccusation[];
  investigations: TypeInvestigations[];
  created_at: string
  updated_at: string
  players: TypePlayerSession[],
}

export interface TypePlayerSession{
  id: number;
  id_game_session: number;
  number: number;
  name: string;
  hash: string;
  is_killer: boolean;
  alive?: boolean;
  suspects_actions?: any;
  winner?: any;
  created_at: string;
  updated_at: string;
  attributes: any[]; //PENDENTE
  reasons: any[]; //PENDENTE
}


export interface TypeAccusation {
  hash_accuser: string;
  hash_accused: string;
  votes: any[];
  eliminated?: any;
}

export interface TypeInvestigations {
  id_investigation: number;
  players: string[];
}
