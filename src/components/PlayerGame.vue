<script lang="ts" setup>
import { useStore } from '../store/appStore';

const store = useStore();
</script>
<template>
  <el-card  class="card-margin" >
    <el-row>
      <el-tag effect="plain">Jogadores</el-tag>
    </el-row>
    <el-row :gutter="20">
      <el-col class="player-col" v-for="(player, i ) of store.gameSession?.players" :key="i"
        :xs="Math.ceil(48 / store.gameSession?.players?.length)">
        <el-card class="player-card">
          {{ player.name ?? '?' }}
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.player-col {
  margin-top: 20px;

  .player-card {
    border-radius: 60px;
    height: 80px;
    background-color: #555555;
  }
}
</style>