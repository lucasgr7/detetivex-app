<script lang="ts" setup>
import { useStore } from '../store/appStore';
import { _game_with_me } from '../mocks/gamesession'

function clearSuspiscious(){
  store.suspect = {};
  store.generateSuspect()
}
function clearAttributes(){
store.myAttributes = [];
store.generateCharacterAttributes();
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
      Clear suspects
    </el-button>
    <el-button @click="clearAttributes">
      Clear attributes
    </el-button>
    <el-button @click="store.clearGameSession()">
      Nova sessão
    </el-button>
  </el-row>
</el-card>
</template>