import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"
import { generateHash } from "../helpers/functions"
import type { Player, TypeGameSession, TypePlayerAttribute } from '../types/api'
import { fetchAttributes } from "../api/scripts"

export const useStore = defineStore('store', {
  state: () => {
    return {
      gameSession: useLocalStorage('gameSession', {} as  TypeGameSession),
      hash: useLocalStorage('hash', generateHash()),
      attributes: useLocalStorage('attributes', [] as TypePlayerAttribute[]),
    }
  },
  getters: {
    myPlayer: (state): Player => {
      return state.gameSession?.players?.filter(x => x.hash === state.hash)[0];
    },
    myAttributes: (state): TypePlayerAttribute[] => {
      const myPlayer = state.gameSession?.players?.filter(x => x.hash === state.hash)[0];
      if(!myPlayer) return [];
      return state.attributes.filter((o) => {
        if(myPlayer.attributes.includes(o.id)) return o;
      });
    }
  },
  actions: {
    clearGameSession() {
      this.gameSession = {} as TypeGameSession;
    },
    async setGameSession(gameSession: any){
      this.gameSession = gameSession;
    },
    async loadAttributes() {
      this.attributes = await fetchAttributes();
    }
  }
})
