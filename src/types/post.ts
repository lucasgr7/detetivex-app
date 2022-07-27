export interface TypeCreateGameSession {
  id_campaign: number;
  player_count: number;
}

export interface TypeRegisterUser {
  gameSessionId: number;
  hash: string;
  name: string;
}

