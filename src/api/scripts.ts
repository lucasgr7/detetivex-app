import { dealWithError } from "../helpers/functions";
import { _game_session_new } from "../mocks/gamesession";
import { TypePlayerAttribute } from "../types/api";
import { TypeCreateGameSession } from "../types/post";

const api = 'http://kg-azevedo.ml/api/detetivex'

export async function fetchAttributes(): Promise<TypePlayerAttribute[]>{
  const response = await fetch(`${api}/attributes`);
  return response.json().then(r => r as TypePlayerAttribute[]) ;
}

export async function createGameSession(body: TypeCreateGameSession){
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
    return response.json();
  }
  catch(exc: any){
    dealWithError(exc);
  }
  return _game_session_new;
}

