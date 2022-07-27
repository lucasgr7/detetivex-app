import { dealWithError } from "../helpers/functions";
import { TypeCreateCampaingResponse, TypeGameSessionResponse, TypePlayerAttribute } from "../types/api";
import { TypeCampaing } from "../types/campaing";
import { TypeCreateGameSession } from "../types/post";

const api = 'http://kg-azevedo.ml/api/detetivex'

export async function fetchAttributes(): Promise<TypePlayerAttribute[]>{
  const response = await fetch(`${api}/attributes`);
  return response.json().then(r => r as TypePlayerAttribute[]) ;
}

export async function createGameSession(body: TypeCreateGameSession): Promise<TypeCreateCampaingResponse>{
  try{
    const response = await fetch(`${api}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(body)
    });
    if(!response.ok){
      throw response.statusText;
    }
    return (await response.json()) as TypeCreateCampaingResponse;
  }
  catch(exc: any){
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

export async function postPlayerIntoGame(idGameSession: number, name: string, hash: string): Promise<void> {
  try{
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
    if(!response.ok){
      throw response.statusText ?? response;
    }
  }
  catch(exc: any){
    dealWithError(exc);
  }
}

export async function startAccusation(user_hash: string,  id_game_session: number): Promise<void> {
  try{
    const response = await fetch(`${api}/sessions/${id_game_session}/startaccusation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        user_hash,
      })
    });
    if(!response.ok){
      throw response.statusText ?? response;
    }
  }
  catch(exc: any){
    dealWithError(exc);
  }
}

export async function postAccusation(user_hash: string, accused_hash: string | null, id_game_session: number): Promise<void> {
  try{
    const response = await fetch(`${api}/sessions/${id_game_session}/accuse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        user_hash,
        accused_hash
      })
    });
    if(!response.ok){
      throw response.statusText ?? response;
    }
  }
  catch(exc: any){
    dealWithError(exc);
  }
}