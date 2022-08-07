<script lang="ts" setup>
import { TransitionPresets, useMouse, useTransition } from '@vueuse/core';
import { ElNotification } from 'element-plus';
import _ from 'lodash';
import { computed, onMounted, ref } from 'vue';
import { useStoreV1 } from '../../store/appV1Store';
import type { TypeMap, TypeCell, TypePlayerV1 } from '../../types/gamev1.js';
import PlayerIcon from './PlayerIcon.vue';

const store = useStoreV1();
const props = defineProps([
  'isAssassin',
  'turn', 
  'players',
  'me',
  'hashPlayerTurn',
  'disabled']);
const emits = defineEmits(['map-update']);

const TURN_HIDE_BODY = 1;
const TURN_MOVE = 2;
// computed
const playersWithoutPosition = computed(() =>{
  return props.players?.filter(player => !player.position || player.position === null);
})

function handleTileMapClick(x: number, y: number){
  if(props.disabled){
    ElNotification({
      title: 'Espere seu turno',
      message: 'Você não pode mover quando não é seu turno',
      type: 'warning'
    });
    return;
  }
  if(props.isAssassin && props.turn === TURN_HIDE_BODY){
    getCellAt(x, y).isHiddenBody = true;
  }
  else if(props.turn === TURN_MOVE){
    purgeMeFromCells();
    const cell = getCellAt(x, y);
    cell?.players?.push(props.me);
    store.gameSession.map.cells?.push(cell);
    store.gameSession.map.cells = _.uniqBy(store.gameSession.map.cells, (x) => x.x + '-' + x.y);
    emits('map-update', store.gameSession.map);
  }
};
function purgeMeFromCells(){
  for(let x = 0; x < store.gameSession.map.xAxis + 1; x++){
    for(let y = 0; y < store.gameSession.map.yAxis + 1; y++){
      const cell = getCellAt(x, y);
      if(cell){
        cell.players = cell.players?.filter(player => player.hash !== props.me.hash);
      }
    }
  }
}
function getCellAt(x: number, y: number): TypeCell{
  const playersAtThisCell = props.players?.filter((player: TypePlayerV1) => 
    player.position && 
    player.position.length > 0 &&
    player.position[0].x === x && 
    player.position[0].y === y);
  let cell =  store.gameSession.map.cells.filter(cell => cell.x === x && cell.y === y)[0];
  if(!cell){
    return {x, y, players: playersAtThisCell};
  }
  // append player to cell if he is not already at the cell
  if(playersAtThisCell && playersAtThisCell.length > 0){
    cell.players = _.uniq(playersAtThisCell);
  }
  return cell;
}

function isMyPlayer(hash: number): boolean{
  return props.me?.hash === hash;
}

function hasVictim(x: number, y: number){
  return getCellAt(x, y)?.isHiddenBody ?? false;
}

function createMapCells(map: TypeMap){
  const cells = [];
  for(let y = 0; y < map.xAxis + 1; y++){
    for(let x = 0; x < map.yAxis  + 1; x++){
      cells.push({
        x, y,
        players: [],
      });
    }
  }
  return cells;
}


onMounted(() => {
  
  if(!store.gameSession.map.cells){
    store.gameSession.map.cells = [];
  }
});
</script>

<template>
<div id="map">
  <el-row justify="center">
    <h2>Mapa</h2>
  </el-row>
  <el-row>
    <el-col :xs="6">
    <h2>
      Jogadores
    </h2>
    </el-col>
    <el-col :xs="16">
      <span class="player-icon"  v-for="(player, i) of playersWithoutPosition">
        <PlayerIcon  :player="player" :hash-player-turn="props.hashPlayerTurn" :is-my-player="isMyPlayer(player.hash)" />
      </span>
    </el-col>
  </el-row>
  <el-row justify="center" v-for="y in store.gameSession.map.yAxis" :key="y">
    <div  v-for="x in store.gameSession.map.xAxis" :key="x" 
      class="map-tile"
      :class="{'red' : hasVictim(x, y)}"
      @click="handleTileMapClick(x, y)"
      >
      {{x}} {{y}}
      <span v-for="(player, i) of getCellAt(x, y).players">
        <PlayerIcon :player="player"
        :is-my-player="isMyPlayer(player.hash)"
        :hash-player-turn="props.hashPlayerTurn"
        >
        </PlayerIcon>
      </span>
    </div>
  </el-row>
</div>
</template>

<style lang="scss">
#map{
  padding: 10px;
  font-size: 24px;
  .map-tile{
    padding: 12px;
    width: 35px;
    height: 35px;
    margin: 4px;
    border: 1px solid rgb(37, 80, 130);
    
    line-height: 24px;
    font-size: 14px;
    color: rgb(176, 217, 221);
    //background smooth light blue  
    background: linear-gradient(to bottom, rgba(205, 235, 238, 0.5) 0%, rgba(29, 121, 129, 0.5) 100%);
    
    // border rounded with slight shadow
    box-shadow: 3px 3px 5px rgb(22, 22, 22);
    border-radius: 2px;

    //background color gradient gray
    

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

  }
  // first row margin-bottom 10 px
  .el-row:first-child{
    margin-bottom: 20px;
  }



  // animate coloring red
  .red{
    animation: color-red 1s;
    background-color: red;
  }
  @keyframes color-red{
    from{
      background-color: #000000;
    }
    to{
      background-color: #ff0000;
    }
  }
  
}
</style>