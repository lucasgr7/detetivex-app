<script lang="ts" setup>

const props = defineProps(['visible']);
</script>
<template>

  <el-dialog v-model="props.visible" title="" width="100%" destroy-on-close center fullscreen>
    <el-row justify="center">
      <h1>Opções</h1>
    </el-row>
    <el-row justify="center">
      <el-col :span="12">
        <el-button type="large">Sair da partida</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="large">Debug Mode</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>