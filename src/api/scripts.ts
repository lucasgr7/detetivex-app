import { defaultWindow } from "@vueuse/core";
import { dealWithError } from "../helpers/functions";
import { Player, TypeCreateCampaingResponse, TypePlayerAttribute } from "../types/api";
import { TypeCampaing } from "../types/campaing";
import { TypeGameSessionResponse } from "../types/game";
import { TypeGeneric } from "../types/generics";
import { TypeCreateGameSession } from "../types/post";

const api = 'https://cors-anywhere.herokuapp.com/http://kg-azevedo.ml/api/detetivex'

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
      while (body.id !== gamesSessionId || limitTries > 0) {
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
  sync: async (gameSessionId: number, content: any) => {
    try {
      const requestPayload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ content })
      };
      debugger;
      const response = await fetch(`${api}/generics`, requestPayload);
      if (!response.ok) {
        throw response.statusText ?? response;
      }
    }
    catch (exc: any) {
      dealWithError(exc);
    }
    return {} as TypeGeneric;
  }
}