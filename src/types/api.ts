
export interface TypePlayerAttribute {
  id:  number;
  points: number;
  name: string;
}


export interface Player {  
  id: number;
  id_game_session: number;
  number: number;
  name: string;
  hash: string;
  is_killer: boolean;
  alive?: boolean;
  suspects_actions?: any;
  winner?: any;
  reasons?: number[];
  created_at: string;
  updated_at: string;
  // events app
  highlight?: boolean;
  selected?: boolean;
}

export interface Accusation {
  initiation__user__hash: string;
  accusated__user__hash: string;
  votes: boolean[];
  eliminated: boolean;
}


// API VERSIONS - KENDÃO
export interface TypeCreateCampaingResponse {
  id_campaign: number
  player_count: number
  updated_at: string
  created_at: string
  id: number
}
