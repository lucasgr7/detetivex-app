<script lang="ts" setup>
import { ElNotification } from 'element-plus';
import _ from 'lodash';
import { computed, onMounted, ref } from 'vue';
import { Player } from '../types/api';

const props = defineProps(['players',
  'columns',
  'hideHeader',
  'fontSize',
  'selection',
  'maxSelection',
  'gameSessionId',
  'totalPlayers',
  'activePlayers']);
const multipleSelect = ref([] as Player[]);

function handlePlayerCardClick(card: Player){
  if(!props.selection) return;
  if(!card.alive){
    ElNotification({
      message: 'Selecione um jogador vivo',
      type: 'warning'
    });
    return;
  }
  
  if(!props.maxSelection){
    if(card.selected){
      card.selected = false;
      emits('selected', null);
      return;
    }
    props.players?.forEach((player: Player) => {
      player.selected = false;
    });
    emits('selected', card);
  }else{
    if(card.selected){
      card.selected = false;
      _.remove(multipleSelect.value, (x) => x.id === card.id)
      emits('selected', multipleSelect.value);
      return;
    }
    else if(multipleSelect.value.length >= props.maxSelection){
      multipleSelect.value[0].selected = false;
      multipleSelect.value.shift();
    }
    multipleSelect.value.push(card);
    emits('selected', multipleSelect.value);
  }
  card.selected = true;
}

const emits = defineEmits(['selected'])
onMounted(() => {
  if(props.players?.length > 0){
    props.players?.forEach(x => x.selected = false);

  }
})
</script>
<template>
  <el-card id="match">
    <template #header>
      <el-row class="title"  v-show="!hideHeader">
        <el-col :xs="12">
        <el-row>
          partida - {{props.gameSessionId}}
        </el-row>
        </el-col>
        <el-col :xs="12">
          <el-row justify="end">
            {{props.activePlayers}}/{{props.totalPlayers}}
          </el-row>
        </el-col>
      </el-row>
    </template>
    <el-row :gutter="20">
      <el-col class="player-col" v-for="(player, i ) of props.players" :key="i"
        :xs="Math.ceil(props.columns / props.totalPlayers)">
        <div 
          :class="{'hightlight': player.highlight, 'selected': player.selected, 'dead': !player.alive}" 
          :style="{'fontSize': props.fontSize + 'px'}" 
          class="player-card"
          @click="handlePlayerCardClick(player)">
          <el-row justify="center" align="middle">
            {{ player?.name ?? '?'}}
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
#match{
  margin-top: 15px;
  border-width: 1px;
  border-style: solid;
  box-sizing: border-box;
  border-color: #005eb6;
  box-shadow: 0px 0px 12px rgba(0, 54, 170, 0.72);
  
  .title {
    color: #0081fa;
  }
}
.player-col {
  margin-top: 12px;

  .player-card {
    border-radius: 60px;
    padding: 20px;
    background-color: #555555;
    &.hightlight {
      border-color: #005eb6;
      box-shadow: 0px 0px 12px rgba(0, 81, 255, 0.72);
      background-color: #005eb6;
    }
    &.selected {
      border-color: #b60000;
      box-shadow: 0px 0px 12px rgba(255, 0, 0, 0.72);
      background-color: #b60000;
    }
    &.dead{
      color: rgb(70, 70, 70);
      border-color: #220000;
      box-shadow: 0px 0px 12px rgba(58, 1, 1, 0.72);
      background-color: #300000;
    }
  }
}
</style>