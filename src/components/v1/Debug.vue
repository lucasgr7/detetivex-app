<script lang="ts" setup>
import { random } from '../../helpers/functions';
import { useStoreV1 } from '../../store/appV1Store';


const store = useStoreV1();
function resetGame() {
  const gameId = store.gameSession.id;
  store.clearMemory();
  
  store.gameSession.id = gameId;
  store.gameSession.assassin_index = random(store.gameSession.player_count);
  store.gameSession.players = [];
  store.gameSession.playerTurn = random(store.gameSession.player_count);
  store.gameSession.gameTurn = 0;
  store.gameSession.map = {
    yAxis: 5,
    xAxis: 5,
    cells: []
  }
  store.saveGame();
}
function removeBody(){
  store.gameSession.map.cells = store.gameSession.map.cells?.map(cell => {
    cell.isHiddenBody = false;
    return cell;
  });
  store.gameSession.gameTurn = 0;
  store.saveGame();
}
</script>

<template>
  <el-row justify="center">
    <el-button @click="removeBody">
      Remove Body
    </el-button>

  </el-row>
</template>