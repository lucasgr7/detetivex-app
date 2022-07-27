<script lang="ts" setup>
import { useStore } from '../store/appStore';
import { _game_session_new, _game_with_me } from '../mocks/gamesession'

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
    <el-button @click="store.setGameSession(_game_session_new)">
      New Game
    </el-button>
    <el-button @click="store.setGameSession(_game_with_me)">
      Game with 1 player
    </el-button>
    <el-button>
      Add Player
    </el-button>
    <el-button>
      initiate Accusation
    </el-button>
    <el-button @click="store.clearGameSession()">
      Nova sessão
    </el-button>
  </el-row>
</el-card>
</template>