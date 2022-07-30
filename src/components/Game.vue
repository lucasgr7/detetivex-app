<script lang="ts" setup>
import ListPlayers from './ListPlayers.vue';
import Debug from './Debug.vue';
import Profile from './Profile.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from '../store/appStore';
import { ElDialog, ElNotification } from 'element-plus';
import GameJoystick from './GameJoystick.vue';
import Narrative from './Narrative.vue';
import AccusationScreen from './AccusationScreen.vue';
import _ from 'lodash';
import InvestigateScreen from './InvestigateScreen.vue';
import VoteAccusationScreen from './VoteAccusationScreen.vue';
import DeathScreen from './DeathScreen.vue';
import EndGame from './EndGame.vue';
import Options from './Options.vue';

const store = useStore();
const isBusy = ref(false);
const playerName = ref('');
const showAccusation = ref(false);
const showInvestigation = ref(false);
const wasAccusing = ref(false);
const isOptionsVisible = ref(false);


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

// computed variables
const someoneStartedAccusation = computed(() => {
  const isAccusing = store.gameSession.is_accusing ?? false;
  if(isAccusing){
    wasAccusing.value = true;
  }
  if(!isAccusing && wasAccusing.value){
    store.iVoted = false;
  }
  return isAccusing;
});
const isGameReady = computed(() => {
  const isGameReady = store.gameSession?.player_count === store.gameSession?.players?.length && store.gameisOn;
  if(isGameReady && !store.gameHasStarted){
    store.startGame();
  }
  return isGameReady;
})
const isAlive = computed(() => {
  return store.myPlayer?.alive ?? true;
})
const isGameFinished = computed(() => {
  // avoid game think it's over before has started
  if(!store.myPlayer || store.gameSession.players?.length != store.gameSession?.player_count){
    return false;
  }
  if(store.gameKillers?.length === store.gameVictims?.length){
    return true;
  }
  if(store.gameKillers?.length === 0){
    return true;
  }
  return false;
})

// refresh page data
setInterval(async () => {
  if(!store) return;
  if(isBusy.value || showInvestigation.value || !isAlive.value) return;
  await store.refreshGameSession();
  console.log('refresh game');
}, 10000)

// actions
function handleSendUserName(){
  if(playerName.value.trim().length == 0){
    ElNotification({
      message: 'Precisa de um nome',
      type: 'warning'
    });
    return;
  }
  store.insertPlayer(playerName.value);
  isBusy.value = false;
}
function startAccusation(){
  if(!store.gameHasStarted) return;
  showAccusation.value = true;
}
function endAccusation(){
  showAccusation.value = false;
  store.gameSession.is_accusing = false;
}
function startinvestigation(){
  if(!store.gameHasStarted) return;
  showInvestigation.value = true;
}
function endInvestigation(){
  showInvestigation.value = false;
}
function showOptions(){
  isOptionsVisible.value = true;
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
  <Debug v-show="store.isDebug"></Debug>
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
    @accuse="startAccusation"
    @investigate="startinvestigation"
    @options="showOptions"></GameJoystick>
  <AccusationScreen 
    :showAccusation="showAccusation"
    @close="endAccusation"></AccusationScreen>
  <InvestigateScreen
    :show-investigation="showInvestigation"
    @close="endInvestigation">
    </InvestigateScreen>
  <VoteAccusationScreen :visible="someoneStartedAccusation"></VoteAccusationScreen>
  <DeathScreen :visible="!isAlive"></DeathScreen>
  <EndGame :visible="isGameFinished"></EndGame>
  <Options @close="isOptionsVisible = false" :visible="isOptionsVisible"></Options>
  <el-row style="height: 100px"></el-row>
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