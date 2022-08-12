<script lang="ts" setup>
import { useStoreV1 } from '../store/appV1Store.js';
import ListPlayers from '../components/ListPlayers.vue';
import Map from '../components/v1/Map.vue';
import { __JOGADORES__ } from '../mocks/campaings_v1.js';
import Joystickv1 from '../components/v1/Joystickv1.vue';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import CreatePlayer from '../components/v1/CreatePlayer.vue';
import { useRoute } from 'vue-router';
import { TypeCell, TypeMap } from '../types/gamev1';
import { ElMessage } from 'element-plus';
import { computed } from '@vue/reactivity';
import Description from '../components/v1/Description.vue';
import IndicatorPoints from '../components/v1/IndicatorPoints.vue';

const TURN_HIDE_BODY = 1;
const TURN_MOVE = 2;
const TURN_INSTALL_TRAP = 3;
const store = useStoreV1();
const route = useRoute();
const gameTurn = ref(TURN_MOVE);
const showAssassinInfo = ref(false);
const idGameSession = typeof(route.params?.id) === 'string' ? parseInt(route.params?.id) : parseInt(route.params?.id[0]);
const hasFindAnything = ref(false);

function handleCreatePlayer(player: any){
  store.createPlayer(player);
}


// computed
async function handleValidateIdGame(){
   if(idGameSession != 0){
    if(store.gameSession?.id != idGameSession){
      store.clearMemory();
    }
    store.gameSession.id = idGameSession;
  }else{
    store.clearMemory();
  }
}
function gameLoop(){
  setInterval(async () => {
    if(store.isMyTurn) return; // cancel if it is player turn
    await store.syncGameData();
  }, 5000)
}
// watch if is my turn
watch(() => store.isMyTurn, (isMyTurnNow: boolean) => {
  if(isMyTurnNow){
    ElMessage({
      message: 'Sua vez',
      type: 'info'
    });
  }
});
// watch when player has created and is an assassin
watch(() => store.myPlayer, (myPlayer: any) => {
  if(myPlayer && myPlayer.is_assassin && !store.hasHiddenBody){
    ElMessage({
      message: 'Você é o assassino',
      type: 'info'
    });
    showAssassinInfo.value = true;
    gameTurn.value = TURN_HIDE_BODY;
  }
});


// actions
function handleFinishTurn(){
  if(!store.hasHiddenBody && gameTurn.value === TURN_HIDE_BODY){
    ElMessage({
      message: 'Esconda o corpo',
      type: 'warning'
    });
    return;
  }
  gameTurn.value = TURN_MOVE;
  store.handleNextTurn();
}
function handleActivateTrapInstall(){
  if(store.myPlayer?.is_assassin){
    if(gameTurn.value === TURN_INSTALL_TRAP){
      gameTurn.value = TURN_MOVE;
    }
    else{
      gameTurn.value = TURN_INSTALL_TRAP;
      ElMessage({
        message: 'Instale uma armadilha',
        type: 'warning'
      });
    }
    return;
  }
}
function handleTrapInstalled(){
  gameTurn.value = TURN_MOVE;
}

onBeforeMount(() => {
  handleValidateIdGame()
})
onMounted(async () => {
  await handleValidateIdGame();
  gameLoop();
  await store.syncGameData();
});
</script>

<template>
  <el-main id="v1">
    <!-- a display of code -->
     <el-row justify="start" style="margin: 12px" class="code">
      Turno: {{gameTurn}}
    </el-row>
    <IndicatorPoints></IndicatorPoints>
    <Description :visible="showAssassinInfo"></Description>
    <CreatePlayer 
      :visible="store.showCreatePlayer"
      @created="handleCreatePlayer"></CreatePlayer>
    <Map v-if="store.isGameLoaded"
      :disabled="!store.isMyTurn"
      :is-assassin="store.myPlayer?.is_assassin" 
      :turn="gameTurn" 
      :players="store.gameSession.players"
      :hash-player-turn="store.hashPlayerTurn"
      :me="store.myPlayer" @trap-installed="handleTrapInstalled">
    </Map>
    <Joystickv1 
      @next-turn="handleFinishTurn"
      @trap-install="handleActivateTrapInstall"></Joystickv1>
  </el-main>
</template>

<style lang="scss">
#v1{
  //border with internal shadow
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  border: solid 1px #dedede;
  color: white;

  padding: 0;
  margin: 0;
  // mobile fixed size
  width: 100%;
  height: 100% !important;


   
}
</style>