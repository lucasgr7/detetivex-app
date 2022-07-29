<script lang="ts" setup>
import { useStore } from '../store/appStore';
import { _game_with_me } from '../mocks/gamesession'
import { faker } from '@faker-js/faker';

function clearSuspiscious(){
  store.suspect = {};
  store.generateSuspect()
}
function clearAttributes(){
store.myAttributes = [];
store.generateCharacterAttributes();
}
async function addPlayer(){
  const fakePlayer = faker.name.findName();
  const fakerId = faker.phone.number();
  await store.insertPlayer(fakePlayer, fakerId);
  console.log(`Add Player ${fakePlayer} - ${fakerId}`)
}
const store = useStore();
</script>
<template>
<el-card>
  <el-row>
    <el-tag type="danger">
      debug
    </el-tag>
  </el-row>
  <el-row>
    <el-button @click="store.setGameSession({})">
      New Game
    </el-button>
    <el-button @click="clearSuspiscious">
      Novos Suspeitos
    </el-button>
    <el-button @click="clearAttributes">
      Nova Personalidade
    </el-button>
    <el-button @click="addPlayer">
      Add Jogador
    </el-button>
    <el-button @click="store.exitGame()">
      Nova sessão
    </el-button>
  </el-row>
</el-card>
</template>