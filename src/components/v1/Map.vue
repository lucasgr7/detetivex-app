<script lang="ts" setup>
import { TransitionPresets, useMouse, useTransition } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import type { TypeMap, TypeCell } from '../../types/gamev1.js';
import PlayerIcon from './PlayerIcon.vue';


const props = defineProps(['map',
  'isAssassin',
  'turn', 
  'players',
  'me']);
const emits = defineEmits(['tile-selected']);
const map = ref({} as TypeMap);

const TURN_HIDE_BODY = 1;
const TURN_MOVE = 2;
// computed
const playersWithoutPosition = computed(() =>{
  return props.players.filter(player => player.position === null);
})

function handleTileMapClick(x: number, y: number){
  if(props.isAssassin && props.turn === TURN_HIDE_BODY){
    getCellAt(x, y).isHiddenBody = true;
  }
  else if(props.turn === TURN_MOVE){
    purgeMeFromCells();
    const cell = getCellAt(x, y);
    cell?.players?.push(props.me)
    emits('tile-selected', {x, y});
  }
};


function purgeMeFromCells(){
  for(let x = 0; x < map.value.xAxis + 1; x++){
    for(let y = 0; y < map.value.yAxis + 1; y++){
      const cell = getCellAt(x, y);
      if(cell){
        cell.players = cell.players?.filter(player => player.id !== props.me.id);
      }
    }
  }
}
function getCellAt(x: number, y: number): TypeCell{
  return map.value.cells.filter(cell => cell.x === x && cell.y === y)[0];
}

function isMyPlayer(hash: number): boolean{
  return props.me.hash === hash;
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
  map.value = props.map;
  map.value.cells = createMapCells(props.map);
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
        <PlayerIcon  :player="player" :is-my-player="isMyPlayer(player.hash)" />
      </span>
    </el-col>
  </el-row>
  <el-row justify="center" v-for="y in map.yAxis" :key="y">
    <div  v-for="x in map.xAxis" :key="x" 
      class="map-tile"
      :class="{'red' : hasVictim(x, y)}"
      @click="handleTileMapClick(x, y)"
      >
      {{x}} {{y}}
      <span v-for="(player, i) of getCellAt(x, y)?.players">
        <PlayerIcon :player="player"
        :is-my-player="isMyPlayer(player.hash)">
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
    border: solid 2px #dedede;
    line-height: 24px;
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