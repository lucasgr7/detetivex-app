import { defaultWindow } from "@vueuse/core";
import { dealWithError, generateHash } from "../helpers/functions";
import { Player, TypeCreateCampaingResponse, TypePlayerAttribute } from "../types/api";
import { TypeCampaing } from "../types/campaing";
import { TypeGameSessionResponse } from "../types/game";
import { TypeGeneric } from "../types/generics";
import { TypeCreateGameSession } from "../types/post";

const api = 'https://cors-prxoy.herokuapp.com/http://kg-azevedo.ml/api/detetivex'

export async function fetchAttributes(): Promise<TypePlayerAttribute[]> {
  const response = await fetch(`${api}/attributes`);
  return response.json().then(r => r as TypePlayerAttribute[]);
}

export async function createGameSession(body: TypeCreateGameSession): Promise<TypeCreateCampaingResponse> {
  try {
    const response = await fetch(`${api}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw response.statusText;
    }
    return (await response.json()) as TypeCreateCampaingResponse;
  }
  catch (exc: any) {
    dealWithError(exc);
  }
  return {} as TypeCreateCampaingResponse;
}

export async function fetchGameSession(id: number): Promise<TypeGameSessionResponse> {
  const response = await fetch(`${api}/sessions/${id}`);
  return response.json().then(r => r as TypeGameSessionResponse);
}


export async function fetchCampaing(id: number): Promise<TypeCampaing> {
  const response = await fetch(`${api}/campaigns/${id}`);
  return response.json().then(r => r as TypeCampaing);
}

export async function fetchAllCampaings(): Promise<TypeCampaing[]> {
  const response = await fetch(`${api}/campaigns`);
  return response.json().then(r => r as TypeCampaing[]);
}

export async function postPlayerIntoGame(idGameSession: number, name: string, hash: string): Promise<void> {
  try {
    const response = await fetch(`${api}/sessions/${idGameSession}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        name,
        hash
      })
    });
    if (!response.ok) {
      throw response.statusText ?? response;
    }
  }
  catch (exc: any) {
    dealWithError(exc);
  }
}

export async function postStartAccusation(user_hash: string, accussed_hash: string, id_game_session: number): Promise<void> {
  try {
    const response = await fetch(`${api}/sessions/${id_game_session}/accusations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        hash_accuser: user_hash,
        hash_accused: accussed_hash
      })
    });
    if (!response.ok) {
      throw response.statusText ?? response;
    }
  }
  catch (exc: any) {
    dealWithError(exc);
  }
}

export async function postAccusation(hash: string, id_game_session: number, value: boolean): Promise<void> {
  try {
    const response = await fetch(`${api}/sessions/${id_game_session}/accusations/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        hash,
        value
      })
    });
    if (!response.ok) {
      throw response.statusText ?? response;
    }
  }
  catch (exc: any) {
    dealWithError(exc);
  }
}

export async function postInvestigation(id_investigation: number, players: string[], idGameSession: number): Promise<void> {
  try {
    const response = await fetch(`${api}/sessions/${idGameSession}/investigations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        id_investigation,
        players
      })
    });
    if (!response.ok) {
      throw response.statusText ?? response;
    }
  }
  catch (exc: any) {
    dealWithError(exc);
  }
}

export const genericsController = {
  get: async (gameSessionId: number): Promise<TypeGeneric> => {
    let response = {} as Response;
    try {
      response = await fetch(`${api}/generics/${gameSessionId}`);
      if (!response.ok) {
        if (response.status === 404) { //generic not generated yet
          return await genericsController.create(gameSessionId);
        }
      }
      return response.json().then(r => r as TypeGeneric);
    } catch (exc: any) {
      dealWithError(exc);
    }
    return {} as TypeGeneric
  },
  create: async (gamesSessionId: number): Promise<TypeGeneric> => {
    try {
      const requestPayload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({})
      };
      let body = {} as TypeGeneric;
      let limitTries = 10;
      while (body.id < gamesSessionId || limitTries > 0) {
        const response = await fetch(`${api}/generics`, requestPayload);
        if (!response.ok) {
          throw response.statusText ?? response;
        }
        await response.json().then(r => body = r as TypeGeneric);
        limitTries--;
      }
      return body;
    }
    catch (exc: any) {
      dealWithError(exc);
    }
    return {} as TypeGeneric;
  },
  sync: async (gameSessionId: number, content: any, syncKey?: string, iterations = 0) => {
    try {
        
      let syncs = content.syncs;
      if(!syncs){
        syncs = [];
      }
      const myKeySync = !syncKey ? generateHash() : syncKey;
      syncs.push(myKeySync);
      content.syncs = syncs;

      const requestPayload = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ content })
      };
      const response = await fetch(`${api}/generics/${gameSessionId}`, requestPayload);
      if (!response.ok) {
        throw response.statusText ?? response;
      }
      // validate has saved the key of sync
      const response2 = await fetch(`${api}/generics/${gameSessionId}`);
      if (!response2.ok) {
        throw response2.statusText ?? response2;
      }
      const body = await response2.json();
      if (!body.content.syncs.includes(myKeySync)) {
        if(iterations < 5){
          return genericsController.sync(gameSessionId, content, myKeySync, iterations + 1);
        }
        throw new Error('Sync key not saved');
      }
      return true;
    }
    catch (exc: any) {
      dealWithError(exc);
    }
    return {} as TypeGeneric;
  },
}