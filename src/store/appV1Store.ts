import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core"
import { createGameSession, fetchGameSession, genericsController } from "../api/scripts";
import { TypeCell, TypeGameV1Session, TypePlayerV1 } from "../types/gamev1";
import { random } from "../helpers/functions";
import { __CAMPAING_V1_HOUSE } from "../mocks/campaings_v1";
import _ from "lodash";

export const useStoreV1 = defineStore('storeV1', {
  state: () => {
    return {
      hash: useLocalStorage('hash', ''),
      gameSession: useLocalStorage('gameSessionV1', {} as  TypeGameV1Session),
      cellAt: useLocalStorage('cellAt', {} as any),
      freeForUpdate: true,
    }
  },
  getters: {
    myPlayer: state => {
      // retrieve my player index position
      const myPlayerIndex = _.findIndex(state.gameSession.players, (player: TypePlayerV1) => player.hash === state.hash);
      const myPlayer = state.gameSession?.players?.find(player => player.hash === state.hash);
      if(!myPlayer) return null;
      myPlayer.is_assassin = myPlayerIndex === state.gameSession.assassin_index;
      return myPlayer;
    },
    hasGameStarted: state => {
      return state.gameSession?.players?.length === state.gameSession.player_count;
    },
    showCreatePlayer: state => {
      return state.gameSession.players?.filter(x => x.hash === state.hash).length === 0;
    },
    freeForUpdate: state => {
      if(state.gameSession.players?.filter(x => x.hash === state.hash).length === 0){
        return false;
      }
      return true;
    },
    isGameLoaded: state => {
      return state.gameSession?.player_count != null;
    },
    hashPlayerTurn: state => {
      return state.gameSession?.players[state.gameSession.playerTurn]?.hash;
    },
    isMyTurn: state => {
      try{
        return state.gameSession?.players[state.gameSession.playerTurn]?.hash === state.hash;
      }
      catch(exc: any){
        return false;
      }
    },
    hasHiddenBody: state => {
      // check for nullables
      if(!state.gameSession.map) return false;
      if(!state.gameSession.map?.cells || state.gameSession.map?.cells?.length === 0) return false;
      return state.gameSession.map.cells.filter((cell: TypeCell) => cell?.isHiddenBody).length > 0;
    }
  },
  actions: {
    async createGame(id_campaign :number, player_count: number): Promise<number> {
      const response = await createGameSession({
        id_campaign,
        player_count
      });
      this.gameSession = {
        id: response.id,
        assassin_index: random(player_count),
        id_campaing: id_campaign,
        player_count: player_count,
        is_accusing: false,
        players: [],
        playerTurn: random(player_count),
        map: {
          yAxis: 5,
          xAxis: 5,
          cells: []
        }
      } as TypeGameV1Session;
      genericsController.create(response.id);
      genericsController.sync(response.id, this.gameSession);
      return response.id;
    },
    async syncGameData() {
      if(!this.gameSession.id) return;
      const {content} = await genericsController.get(this.gameSession.id);
      if(!content) return;
      if(!_.isEqual(this.gameSession, content)){
        this.gameSession = content;
      }

    },
    _getMyPlayer_() {
      const myPlayerIndex = _.findIndex(this.gameSession.players, (player: TypePlayerV1) => player.hash === this.hash);
      const myPlayer = this.gameSession?.players?.find(player => player.hash === this.hash);
      if(!myPlayer) return null;
      myPlayer.is_assassin = myPlayerIndex === this.gameSession.assassin_index;
      return myPlayer;
    },
    async createPlayer(player: TypePlayerV1): Promise<boolean> {
      // validate user has color, if not assing a random one
      const defaultColors = ['red', 'blue', 'green', 'yellow'];
      if(!player.color){
        player.color = defaultColors[random(4)];
      }
      // validate player has attributes if not assing None to him
      if(!player.personality){
        player.personality = [{
          id: 0,
          points: 0,
          name: 'Nenhum'
        }];
      }

      player.hash = this.hash;

      player.points = player.personality.reduce((acc, curr) => acc + curr.points ?? 0, 0);

      const campaing = __CAMPAING_V1_HOUSE;
      // pick one random weapont from the campaing and assing to the player
      const randomWeapon = campaing.weapons[random(campaing.weapons.length)];
      player.weapons = [randomWeapon];
      // pick three random object from the campaing and assing to the player
      const randomObjects = _.shuffle(campaing.objects).slice(0, 3);
      player.objects = randomObjects;
      // add the player to the game
      if(!this.gameSession.players){
        this.gameSession.players = [];
      }
      this.gameSession.players.push(player);
      // sync the game to the server
      genericsController.sync(this.gameSession.id, this.gameSession);
      return true;
    },
    clearMemory(){
      this.gameSession = {} as TypeGameV1Session;
    },
    handleNextTurn(): void{
      if(this.gameSession.playerTurn === this.gameSession.players.length - 1){
        this.gameSession.playerTurn = 0;
      }else{
        this.gameSession.playerTurn++;
      }
      // each player gains one point
      this.gameSession.players.forEach(player => {
        player.points++;
      });

      this.saveGame();
      this.savePlayerCell();
    },
    saveGame(): void{
      genericsController.sync(this.gameSession.id, this.gameSession);
    },
    savePlayerCell(): void{
      // find cell where my player is at
      const myPlayerCell = this.gameSession.map?.cells?.find(cell => cell.players?.find(player => player.hash === this.hash));
      if(!myPlayerCell) return;
      this.cellAt = myPlayerCell;
    },
    unlockPersonInfo(): void{
      if(!this.myPlayer) return;
      const points = this.myPlayer?.points - 2;
      // patch my player into gameSession.players
      this.gameSession.players = this.gameSession.players.map(player => {
        if(player.hash === this.hash){
          player.points = points;
        }
        return player;
      });
      console.table(this.myPlayer)
      this.saveGame();
    }
  },
});