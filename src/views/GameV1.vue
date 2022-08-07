<script lang="ts" setup>
import { useStoreV1 } from '../store/appV1Store.js';
import ListPlayers from '../components/ListPlayers.vue';
import Map from '../components/v1/Map.vue';
import { __JOGADORES__ } from '../mocks/campaings_v1.js';
import Joystickv1 from '../components/v1/Joystickv1.vue';
import { onBeforeMount, onMounted } from 'vue';
import CreatePlayer from '../components/v1/CreatePlayer.vue';
import { useRoute } from 'vue-router';
import { TypeMap } from '../types/gamev1';

const TURN_HIDE_BODY = 1;
const TURN_MOVE = 2;
const store = useStoreV1();
const route = useRoute();
const idGameSession = typeof(route.params?.id) === 'string' ? parseInt(route.params?.id) : parseInt(route.params?.id[0]);

function handleTileMapClick(map: TypeMap) {
  // store.gameSession.map = map
}
function handleCreatePlayer(player: any){
  store.createPlayer(player);
}

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

// actions
function handleFinishTurn(){
  store.handleNextTurn();
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
    <CreatePlayer 
      :visible="store.showCreatePlayer"
      @created="handleCreatePlayer"></CreatePlayer>
    <Map v-if="store.isGameLoaded"
      :disabled="!store.isMyTurn"
      :is-assassin="true" 
      :turn="TURN_MOVE" 
      :players="store.gameSession.players"
      :hash-player-turn="store.hashPlayerTurn"
      :me="store.myPlayer" @map-update="handleTileMapClick">
    </Map>
    <Joystickv1 @next-turn="handleFinishTurn"></Joystickv1>
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