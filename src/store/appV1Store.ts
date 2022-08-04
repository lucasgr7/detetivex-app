import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core"
import { createGameSession, fetchGameSession, genericsController } from "../api/scripts";
import { TypeGameV1Session } from "../types/gamev1";

export const useStoreV1 = defineStore('storeV1', {
  state: () => {
    return {
      hash: useLocalStorage('hash', ''),
      gameSession: useLocalStorage('gameSessionV1', {} as  TypeGameV1Session)
    }
  },
  getters: {
    myPlayer: state => {
      return state.gameSession.players.find(player => player.hash === state.hash)
    }
  },
  actions: {
    async createGame(id_campaign :number, player_count: number): Promise<number> {
      const response = await createGameSession({
        id_campaign,
        player_count
      });
      //TODO: randomize asasssin,
      debugger;
      this.gameSession = {
        id: response.id,
        accusations: [],
        id_campaing: id_campaign,
        player_count: player_count,
        is_accusing: false,
        players: [],
        map: {
          yAxis: 5,
          xAxis: 5,
          names: ['Sala', 
          'Quarto infantil', 
          'Cozinha',
          'Garagem', 
          'Suite', 
          'Banheiro 1', 
          'Banheiro 2', 
          'Sala de Estar']
        }
      } as TypeGameV1Session;
      genericsController.create(response.id);
      genericsController.sync(response.id, this.gameSession);
      return response.id;
    }
  },
});