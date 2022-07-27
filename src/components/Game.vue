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
const inputPlayerName = ref(false);
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
  inputPlayerName.value = store.firstTime;
});
watch(() => store.gameSession.players, () => {
  if(store.gameSession.players?.length === store.gameSession.player_count){
    store.startGame();
  }
});

const someoneStartedAccusation = computed(() => {
  return store.gameSession.is_accusing;
})

// refresh page data
setInterval(async () => {
  if(!store) return;
  if(store.gameSession?.is_accusing) return;
  await store.refreshGameSession();
  console.log('refresh game');
}, 10000)

// actions
function handleSendUserName(){
  store.insertPlayer(playerName.value);
  inputPlayerName.value = false;
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
  inputPlayerName.value = store.firstTime;
  await store.loadCampaing();
})
</script>

<template>
<div id="game">
  <el-dialog
      v-model="inputPlayerName"
      title="Seu nome"
      width="100%"
      destroy-on-close
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    <el-row>
      <el-input autofocus type="text" v-model="playerName">
      </el-input>
    </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button plain effect="dark" type="primary" @click="handleSendUserName">Protinho</el-button
          >
        </span>
      </template>
  </el-dialog>
  <Debug></Debug>
  <ListPlayers :players="players" 
    :columns="48"></ListPlayers>
  <Profile></Profile>
  <Narrative></Narrative>  
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
}
.card-margin{
  margin-top: 40px;
}
.el-main{
  padding: 0 !important;
}
</style>