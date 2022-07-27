import { TypeCampaing } from "./campaing"

export interface TypeGameSessionResponse {
  id: number
  id_campaign: number
  player_count: number
  is_accusing: any
  accusations: any
  investigations: any
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
  alive?: any;
  suspects_actions?: any;
  winner?: any;
  created_at: string;
  updated_at: string;
  attributes: any[]; //PENDENTE
  reasons: any[]; //PENDENTE
}