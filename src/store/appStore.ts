import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"
import { chance, generateHash } from "../helpers/functions"
import type { Player, TypeCreateCampaingResponse,  TypePlayerAttribute } from '../types/api'
import type { TypeGameSessionResponse } from "../types/game"

import { fetchAllCampaings, fetchAttributes, fetchCampaing, fetchGameSession, genericsController, postPlayerIntoGame, postStartAccusation } from "../api/scripts"
import _ from "lodash"
import { TypeCampaing, TypeSuspect } from "../types/campaing"
import { _fake_investigation } from "../mocks/campaing"
import { TypeContent } from "../types/generics"
import { __mock_attributes__ } from "../mocks/attributes"
import { useRouter } from "vue-router"

export const useStore = defineStore('store', {
  state: () => {
    return {
      gameSession: useLocalStorage('gameSession', {} as  TypeGameSessionResponse),
      hash: useLocalStorage('hash', generateHash()),
      attributes: useLocalStorage('attributes', [] as TypePlayerAttribute[]),
      campaing: useLocalStorage('campaing', {} as TypeCampaing),
      suspect: useLocalStorage('suspect', {} as TypeSuspect),
      myAttributes: useLocalStorage('myAttributes', [] as TypePlayerAttribute[]),
      iVoted: useLocalStorage('iVoted', false),
      campaings: useLocalStorage('campaings', [] as TypeCampaing[]),
      gameHasStarted: useLocalStorage('gameHasStarted', false),
      isDebug: false,
      db: useLocalStorage('db', {} as TypeContent),
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
    },
    gameisOn: (state): boolean => {
      return state.gameSession?.players?.length === state.gameSession?.player_count 
        && !_.isEmpty(state.gameSession)
        && state.gameSession?.player_count > 0;
    },
    lastPlayerInvestigate: (state): boolean => {
      if( state.db?.investigators?.length === 0){
        return false;
      }
      if(_.isEmpty(state.db?.investigators)) return false;
      const lastInvestigator = state.db?.investigators[state.db?.investigators?.length - 1];
      const hasMyPlayer = state.gameSession?.players?.filter(x => x.hash === state.hash);
      if(hasMyPlayer.length === 0) {
        return false;
      }
      return state.gameSession?.players?.filter(x => x.hash === state.hash)[0].hash === lastInvestigator;
    }
  },
  actions: {
    exitGame() {
      this.clearMemory();
      const router = useRouter();
      router.replace("/");
    },
    clearMemory() {
      this.gameSession = {} as TypeGameSessionResponse;
      this.suspect = {} as TypeSuspect;
      this.campaing = {} as TypeCampaing;
      this.myAttributes = [] as TypePlayerAttribute[];
      this.gameHasStarted = false;
    },
    setGameSession(game: any){
      this.gameSession = game;
    },
    async createSession(gameSession: TypeCreateCampaingResponse){
      this.gameSession = await fetchGameSession(gameSession.id);

    },
    async refreshGameSession(){
      const updateVersion = await fetchGameSession(this.gameSession.id);
      const generics = await genericsController.get(this.gameSession.id);
      if(!_.isEqual(updateVersion, this.gameSession)){
        this.gameSession = updateVersion;
        this.loadCampaing();
      }else{
        console.log('Sem atualização')
      }
      if(!_.isEqual(this.db, generics)){
        this.db = generics.content;
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
      this.attributes = __mock_attributes__;
    },
    async loadAllCampaings(){
      this.campaings = await fetchAllCampaings();
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
      if(this.gameisOn){
        this.generateSuspect();
        this.generateCharacterAttributes();
        this.gameHasStarted = true;
      }
    },
    async generateSuspect() {
      console.warn('Gerando suspeito');
      const FROM_HUNDRED = 101, CHANCE_SUSPECT_SOMEONE = 64, SUSPECT_REAL_KILLER = 33;
      if(!this.campaing){
        await this.loadCampaing();
      }
      
      if(_.isEmpty(this.suspect) && this.myPlayer && !this.myPlayer?.is_killer){
        
        if(chance(FROM_HUNDRED) < CHANCE_SUSPECT_SOMEONE){ // SUSPEITA?
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
            who: null,
            details: null,
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
    },
    setAttributes(attr: TypePlayerAttribute[]):void {
      this.myAttributes = attr;
    },
    async addLastInvestigator() {
      if(!this.db || !this.db?.investigators){
        this.db = {
          investigators: []
        }
      }
      this.db.investigators.push(this.myPlayer.hash)
      genericsController.sync(this.gameSession.id, this.db);
    }
  }
})
