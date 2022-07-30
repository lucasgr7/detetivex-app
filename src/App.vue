<script setup lang="ts">
import CampaingView from "./components/CreateCampaing.vue"
import { _campaing_1 } from "./mocks/campaing"
import { useStore } from "./store/appStore";
import _ from 'lodash';
import Game from "./components/Game.vue";
import { onMounted } from "vue";

const store = useStore();

const params = new URLSearchParams(window.location.search);
let paramGame = params.get("id") ?? '0';
const idGameSession = parseInt(paramGame);

onMounted(async() => {
  store.loadAllCampaings();
  store.loadAttributes();
  if(idGameSession != 0){
    if(store.gameSession?.id != idGameSession){
      store.clearMemory();
    }
    store.gameSession.id = idGameSession;
    await store.refreshGameSession();
  }else{
    store.clearMemory();
  }
})
</script>

<template>
<el-main>
  <CampaingView v-if="_.isEmpty(store.gameSession)" :campaings="store.campaings"></CampaingView>
  <Game v-else></Game>
</el-main>
</template>

<style scoped>
span{
  font-size: 18px;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
