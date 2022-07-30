<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { useStore } from '../store/appStore';


const store = useStore();
const props = defineProps(['visible']);
const emits = defineEmits(['close'])
</script>
<template>

  <el-dialog @close="emits('close')" v-model="props.visible" title="" width="100%" destroy-on-close center fullscreen>
    <el-row justify="center">
      <h1>Opções</h1>
    </el-row>
    <el-row justify="center">
      <el-col :span="12">
        <el-button @click="store.exitGame()" type="large">Sair da partida</el-button>
      </el-col>
      <el-col :span="12">
        <el-button @click="store.isDebug = !store.isDebug" type="large">Debug Mode</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>