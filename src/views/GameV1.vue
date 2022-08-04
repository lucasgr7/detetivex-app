<script lang="ts" setup>
import { useStoreV1 } from '../store/appV1Store.js';
import ListPlayers from '../components/ListPlayers.vue';
import Map from '../components/v1/Map.vue';
import { __JOGADORES__ } from '../mocks/campaings_v1.js';
import Joystickv1 from '../components/v1/Joystickv1.vue';

const TURN_HIDE_BODY = 1;
const TURN_MOVE = 2;
const store = useStoreV1();

store.gameSession.player_count = 4;
store.gameSession.players = __JOGADORES__;

function handleTileMapClick(x: number, y: number) {
  const me = store.gameSession.players.filter(player => player.hash === store.hash)[0];
  me.position = [x, y];
}

</script>

<template>
  <el-main id="v1">
    <Map :map="store.gameSession.map" :is-assassin="true" :turn="TURN_MOVE" :players="store.gameSession.players"
      :me="store.myPlayer" @tile-selected="handleTileMapClick">
    </Map>
    <Joystickv1></Joystickv1>
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

  background-image: linear-gradient(to bottom, #290c49 0%, #13215f 100%);
  // animated slowing brighintg up of the background
  animation: fff 5s infinite;
  @keyframes fff {
    0% {
      background-color: #290c49;
    }
    50% {
      background-color: #13215f;
    }
    100% {
      background-color: #290c49;
    }
  }


   
}
</style>