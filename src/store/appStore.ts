import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"
import { chance, generateHash } from "../helpers/functions"
import type { Player, TypeCreateCampaingResponse,  TypePlayerAttribute } from '../types/api'
import type { TypeGameSessionResponse } from "../types/game"

import { fetchAttributes, fetchCampaing, fetchGameSession, postPlayerIntoGame, postStartAccusation } from "../api/scripts"
import _ from "lodash"
import { TypeCampaing } from "../types/campaing"
import { _fake_investigation } from "../mocks/campaing"

export const useStore = defineStore('store', {
  state: () => {
    return {
      gameSession: useLocalStorage('gameSession', {} as  TypeGameSessionResponse),
      hash: useLocalStorage('hash', generateHash()),
      attributes: useLocalStorage('attributes', [] as TypePlayerAttribute[]),
      campaing: useLocalStorage('campaing', {} as TypeCampaing),
      suspect: useLocalStorage('suspect', {}),
      myAttributes: useLocalStorage('myAttributes', [] as TypePlayerAttribute[]),
      iVoted: useLocalStorage('iVoted', false)
    }
  },
  getters: {
    myPlayer: (state): Player => {
      return state.gameSession?.players?.filter(x => x.hash === state.hash)[0];
    },
    everyoneButMe: (state): Player[] => {
      return _.filter(state.gameSession?.players, (it) => 
      it.hash !== state.hash)
    },
    everyoneButMeAlive: (state): Player[] => {
      return _.filter(state.gameSession?.players, (it) => 
      it.hash !== state.hash)
    },
    gameKillers: (state): Player[] => {
      return _.filter(state.gameSession?.players, (it) => 
        it.is_killer && it.alive == true)
    },
    gameKillersDOA: (state): Player[] => {
      return _.filter(state.gameSession?.players, (it) => 
        it.is_killer)
    },
    gameVictims: (state): Player[] => {
      return _.filter(state.gameSession?.players, (it) => 
        !it.is_killer && it.alive == true )
    },
    firstTime: (state): boolean => {
      return state.gameSession?.players?.filter(x => x.hash === state.hash).length == 0;
    }
  },
  actions: {
    clearGameSession() {
      this.gameSession = {} as TypeGameSessionResponse;
      this.suspect = {};
      this.campaing = {} as TypeCampaing;
      this.myAttributes = [] as TypePlayerAttribute[];
    },
    setGameSession(game: any){
      this.gameSession = game;
    },
    async createSession(gameSession: TypeCreateCampaingResponse){
      this.gameSession = await fetchGameSession(gameSession.id);
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('id', gameSession.id.toString());
      window.location.search = urlParams.toString();

    },
    async refreshGameSession(){
      const updateVersion = await fetchGameSession(this.gameSession.id);
      if(!_.isEqual(updateVersion, this.gameSession)){
        this.gameSession = updateVersion;
        this.loadCampaing();
      }else{
        console.log('Sem atualização')
      }
    },
    async insertPlayer(name: string, hash?: string){
      if(!hash){
        hash = this.hash;
      }
      await postPlayerIntoGame(this.gameSession.id, name, hash);
      console.log(`Estou entrando no jogo ${this.gameSession.id} ${name} - ${this.hash}`)
    },
    async loadAttributes() {
      this.attributes = await fetchAttributes();
    },
    async loadCampaing() {
      this.campaing = await fetchCampaing(this.gameSession.id_campaign);
      if(!this.campaing.investigations || _.isEmpty(this.campaing.investigations)){
        this.campaing.investigations = _fake_investigation;
      }
      // reset iVoted if user refresh
      if(this.iVoted && !this.gameSession.is_accusing){
        this.iVoted = false;
      }
    },
    async startGame(){
      this.generateSuspect();
      this.generateCharacterAttributes();
    },
    async generateSuspect() {
      const FROM_HUNDRED = 101, CHANCE_SUSPECT_SOMEONE = 64, SUSPECT_REAL_KILLER = 33;
      if(_.isEmpty(this.suspect) && !this.myPlayer.is_killer){
        if(chance(FROM_HUNDRED) < CHANCE_SUSPECT_SOMEONE){
          if(chance(FROM_HUNDRED) < SUSPECT_REAL_KILLER){ // 33% suspect a real killer
            this.suspect = {
              who: this.gameKillers[chance(this.gameKillers?.length)],
              details: this.campaing.suspects_actions[chance(this.campaing.suspects_actions?.length)]
            }
          }
          else{ // 45% suspect a anyone else
            this.suspect = {
              who: this.everyoneButMe[chance(this.everyoneButMe?.length)],
              details: this.campaing.suspects_actions[chance(this.campaing.suspects_actions?.length)]
            }
          }
        }else{
          this.suspect = {
            who: null
          }
        }
      }
    },
    generateCharacterAttributes(){
      const FROM_HUNDRED = 101, ONE_MUT = 50, TWO_MUT = 25, THREE_MUT = 10, FOUR_MUT = 6;
      if(_.isEmpty(this.myAttributes)){
        const mutations = chance(FROM_HUNDRED);
        let iterations = 0;
        if(mutations < FOUR_MUT){
          iterations = 4
        }
        else if(mutations < THREE_MUT){
          iterations = 3
        }
        else if(mutations < TWO_MUT){
          iterations = 2
        }
        else if(mutations < ONE_MUT){
          iterations = 1
        }
        if(iterations === 0 ){
          this.myAttributes.push({
            id: 0,
            name: 'Nenhuma'
          });
        }
        while(this.myAttributes.length < iterations){
          const attributes = [...this.myAttributes, this.attributes[chance(this.attributes?.length)]]
          this.myAttributes = _.union(attributes);
        }
      }
    }
  }
})
