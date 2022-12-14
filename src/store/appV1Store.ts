import { defineStore, storeToRefs } from "pinia";
import { useLocalStorage } from "@vueuse/core"
import { createGameSession, fetchGameSession, genericsController } from "../api/scripts";
import { TypeCell, TypeGameV1Session, TypePlayerV1, TypeReveal } from "../types/gamev1";
import { generateHash, random } from "../helpers/functions";
import { __CAMPAING_V1_HOUSE } from "../mocks/campaings_v1";
import _ from "lodash";
import { clueTypeGenerator } from "../helpers/clueGenerator";
import { GAME_SETTINGS } from "../settings";

export const useStoreV1 = defineStore('storeV1', {
  state: () => {
    return {
      hash: useLocalStorage('hash',  generateHash()),
      gameSession: useLocalStorage('gameSessionV1', {} as  TypeGameV1Session),
      cellAt: useLocalStorage('cellAt', {} as TypeCell),
      freeForUpdate: true,
      cluesRevealed: useLocalStorage('cluesRevealed', [] as any),
      pointsSpent: useLocalStorage('pointsSpent', 0),
      reveal: false,
      queueTraps: useLocalStorage('queueTraps', [] as any),
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
        if(!state.gameSession.map) return false;
        if(!state.gameSession.map?.cells || state.gameSession.map?.cells?.length === 0) return false;
        if(state.gameSession.map.cells.filter((cell: TypeCell) => cell?.isHiddenBody).length <= 0) return false;
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
    },
    myPoints: state => {
      const total = state.gameSession.gameTurn - state.pointsSpent;
      if(total > 10) return 10;
      return total;
    },
    revealCell : (state): TypeReveal =>{
      // INFO: 'far' pictures are actually near and near is far
      let image = null;
      let text = null;
      let hasClue = false;
      if(state.cellAt?.isNearBody){
        // pick a random picture from the far pictures
        const randomIndex = random(8) +1;
        image = `/images/clues/near/far${randomIndex}.png`;
        if(state.cellAt.clue){
          text = state.cellAt?.clue;
          hasClue = true;
        }
        if(text == null){
          text = 'Voc?? est?? pr??ximo a algo importante';
        }
      }
      else if(state.cellAt.isHiddenBody){
        image = `/images/clues/body-found.png`;
        text = 'V??tima encontrada ' + state.cellAt.clue;
        hasClue = true;
      }

      if(text == null){
        text = 'N??o h?? nada por aqui...';
      }
      // if is far from body pic a far picture
      if(image == null){
        const randomIndex = random(9)+1;
        image = `/images/clues/far/near${randomIndex}.png`;
      }
      return { image, text, hasClue } as TypeReveal
    }
  },
  actions: {
    // Game Creation
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
        gameTurn: 0,
        revealed_clues: [],
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
      const randomObjects = _.shuffle(campaing.objects).slice(0, 4);
      randomObjects.forEach(object => {
        if(!object.type) return;
        // generate a random attribute for the object
        const attributeClue = clueTypeGenerator(object.type);
        object.clue += attributeClue;
        object.name += attributeClue;
      })
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
    _getMyPlayer_() {
      const myPlayerIndex = _.findIndex(this.gameSession.players, (player: TypePlayerV1) => player.hash === this.hash);
      const myPlayer = this.gameSession?.players?.find(player => player.hash === this.hash);
      if(!myPlayer) return null;
      myPlayer.is_assassin = myPlayerIndex === this.gameSession.assassin_index;
      return myPlayer;
    },
    clearMemory(){
      this.gameSession = {} as TypeGameV1Session;
      this.cellAt = {} as any;
      this.cluesRevealed = [];
      this.pointsSpent = 0;
    },

    // game events
    handleNextTurn(): void {
      if(this.gameSession.playerTurn === this.gameSession.players.length - 1){
        this.gameSession.playerTurn = 0;
      }else{
        this.gameSession.playerTurn++;
      }
      this.gameSession.gameTurn += 1;
      this.savePlayerCell();
      this.saveGame();
    },
    saveGame(): void{
      if(this.queueTraps?.length > 0){
        this.dequeueTrap();
      }
      genericsController.sync(this.gameSession.id, this.gameSession);
    },
    savePlayerCell(): void{
      // find cell where my player is at
      const myPlayerCell = this.gameSession.map?.cells?.find(cell => cell.players?.find(player => player.hash === this.hash));
      if(!myPlayerCell) return;
      this.cellAt = myPlayerCell;
      this.reveal = true;
      debugger;
      if(myPlayerCell.isHiddenBody){
        this.gameSession.is_victim_found = true;
      }
    },
    unlockPersonInfo(itemRevealed: any): void{
      this.spentPoints(GAME_SETTINGS.POINTS_EXPENSE.REVEAL_PLAYER_ITEM);
      if(!this.cluesRevealed) this.cluesRevealed = [];
      this.cluesRevealed.push(itemRevealed);
      this.saveGame();
    },
    closeReveal(): void {
      this.reveal = false;
    },
    saveReavealedClue(clue: string): void{
      if(!this.gameSession.revealed_clues.includes(clue)){
        this.gameSession.revealed_clues.push(clue);
        this.saveGame();
      }
    },

    // map
    placeTrap(cell: TypeCell): void{
      cell.hasTrap = true;
      this.spentPoints(GAME_SETTINGS.POINTS_EXPENSE.PLACE_TRAP);
      this.queueTraps.push(cell);
    },
    dequeueTrap(): void{
      const myPlayer = this._getMyPlayer_();
      if(myPlayer?.is_assassin){
        // iterate each queueTrap
        this.queueTraps.forEach((cell: TypeCell) => {
          this.updateCells(cell);
        });
        this.queueTraps = [];
      }
    },
    spentPoints(points: number): void{
      if(!this.myPlayer) return;
      const pointsUserWantSpent = this.pointsSpent + points;
      const totalPoints = this.gameSession.gameTurn - pointsUserWantSpent;
      if(totalPoints < 0){
        throw new Error('Voc?? n??o tem pontos suficientes');
      }
      this.pointsSpent += points;
    },
    purgeMyPlayerFromCells(){
      for(let x = 0; x < this.gameSession.map.xAxis + 1; x++){
        for(let y = 0; y < this.gameSession.map.yAxis + 1; y++){
          const cell = this.getCellAt(x, y);
          if(cell){
            cell.players = cell.players?.filter(player => player.hash !== this.hash);
          }
        }
      }
    },
    updateCells(cell: TypeCell){
      // check cell exist in map
      const cellInMap = this.getCellAt(cell.x, cell.y);
      if(!cellInMap){
        this.gameSession.map.cells?.push(cell);
      }
      else{
        // update cell
        cellInMap.hasTrap = cell.hasTrap;
        cellInMap.isHiddenBody = cell.isHiddenBody;
        cellInMap.players = cell.players;
        this.gameSession.map.cells?.push(cellInMap);
      }
      this.gameSession.map.cells = _.uniqBy(this.gameSession.map.cells, (x) => x.x + '-' + x.y);
    },
    getCellAt(x: number, y: number): TypeCell{
      if(!this.gameSession.map || !this.gameSession.map.cells) return {} as TypeCell;
      const playersAtThisCell = this.gameSession.players?.filter((player: TypePlayerV1) => 
        player.position && 
        player.position.length > 0 &&
        player.position[0].x === x && 
        player.position[0].y === y);
      let cell =  this.gameSession.map.cells.filter(cell => cell.x === x && cell.y === y)[0];
      if(!cell){
        return {x, y, players: playersAtThisCell};
      }
      // append player to cell if he is not already at the cell
      if(playersAtThisCell && playersAtThisCell.length > 0){
        cell.players = _.uniq(playersAtThisCell);
      }
      // fix for when cell has no array for players
      if(!cell?.players){
        cell.players = [];
      }
      return cell;
    },
    placeCluesAroundCellWithBody(): void{
      console.table(this.gameSession?.map?.cells);
      // check if gamesession map and cells is valid
      if(!this.gameSession.map || !this.gameSession.map.cells)return;
      // find cell with hidden body
      const cellWithHiddenBody = this.gameSession.map.cells.find((cell: TypeCell) => cell.isHiddenBody);

      if(!cellWithHiddenBody) return;

      const assassin = this.myPlayer;
      if(assassin == null || assassin.objects == null || !assassin?.weapons) return;
      
      // place the death weapon clue
      cellWithHiddenBody.clue = assassin?.weapons[0].clue;

      // select all the cells around the cell with the hidden body
      const cellsAround = this.generateCellsAround(cellWithHiddenBody.x, cellWithHiddenBody.y);
      cellsAround.forEach((cell: TypeCell) => {
        cell.isNearBody = true;
      });
      // select 3 random cells from cellsAround
      const randomCells = _.shuffle(cellsAround).slice(0, 3);
      // assign clues to the random cells
      randomCells.forEach((cell: TypeCell, idx: number) => {
        cell.clue = assassin.objects[idx].clue;
        this.gameSession.map.cells?.push(cell);
      });      
    },
    generateCellsAround(x: number, y: number): TypeCell[]{
      const cells = [];
      for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
          if(i === 0 && j === 0) continue;
          const cell = {
            x: x + i,
            y: y + j,
            players: [],
          }
          cells.push(cell);
        }
      }
      return cells;
    },
  }
});