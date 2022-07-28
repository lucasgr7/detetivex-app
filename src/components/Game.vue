<script lang="ts" setup>
import ListPlayers from './ListPlayers.vue';
import Debug from './Debug.vue';
import Profile from './Profile.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from '../store/appStore';
import { ElDialog } from 'element-plus';
import GameJoystick from './GameJoystick.vue';
import Narrative from './Narrative.vue';
import AccusationScreen from './AccusationScreen.vue';
import _ from 'lodash';

const store = useStore();
const isBusy = ref(false);
const playerName = ref('');
const showAccusation = ref(false);


const players = computed(() => {
  const me = _.clone(store.myPlayer);
  if(!me) return {};
  me.name = 'você';
  me.highlight = true;
  return [me, ...store.everyoneButMe];
})

watch(() => store.firstTime, () => {
  isBusy.value = store.firstTime;
});
watch(() => store.gameSession.players, () => {
  if(store.gameSession.players?.length === store.gameSession.player_count){
    store.startGame();
  }
});

// computed variables
const someoneStartedAccusation = computed(() => {
  return store.gameSession.is_accusing;
});
const isGameReady = computed(() => {
  const isGameReady = store.gameSession.player_count === store.gameSession?.players.length;
  if(isGameReady){
    store.startGame();
  }
  return isGameReady;
})

// refresh page data
setInterval(async () => {
  if(!store) return;
  if(store.gameSession?.is_accusing || isBusy.value) return;
  await store.refreshGameSession();
  console.log('refresh game');
}, 10000)

// actions
function handleSendUserName(){
  store.insertPlayer(playerName.value);
  isBusy.value = false;
}
function startAccusation(){
  showAccusation.value = true;
  store.gameSession.is_accusing = true;
}
function endAccusation(){
  showAccusation.value = false;
  store.gameSession.is_accusing = false;
}

onMounted(async () => {
  isBusy.value = store.firstTime;
  await store.loadCampaing();
})
</script>

<template>
<div id="game">
  <el-dialog
      v-model="isBusy"
      title="Seu nome"
      width="100%"
      destroy-on-close
      center
      fullscreen
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    <el-row align="middle" style="height: 200px">
      <el-input autofocus type="text" v-model="playerName">
      </el-input>
    </el-row>
    <el-row justify="center">
        <span class="dialog-footer">
          <el-button plain effect="dark" type="primary" @click="handleSendUserName">Protinho</el-button
          >
        </span>
    </el-row>
  </el-dialog>
  <Debug></Debug>
  <ListPlayers :players="players" 
    :columns="48"></ListPlayers>
  <div v-if="isGameReady">
    <Profile></Profile>
    <Narrative></Narrative>
  </div>
  <div class="wait" v-else>
    <el-card v-loading="!isGameReady"
    element-loading-text="Aguardando jogadores...">
    </el-card>
  </div>
  <GameJoystick 
    @accuse="startAccusation"></GameJoystick>
  <AccusationScreen 
    :showAccusation="showAccusation || someoneStartedAccusation"
    @close="endAccusation"></AccusationScreen>
  <el-row style="height: 300px"></el-row>
</div>
</template>

<style lang="scss">
#game{
  max-width: 100%;
  padding: 15px;
  font-size: 20px;
  div.wait{
    margin-top: 20px;
    .el-card{
      height: 200px;
    }
  }
}
.card-margin{
  margin-top: 40px;
}
.el-main{
  padding: 0 !important;
}
</style>