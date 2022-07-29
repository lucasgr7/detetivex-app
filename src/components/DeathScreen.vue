<script lang="ts" setup>
import { useStore } from '../store/appStore';
import gifSkull from '../assets/gifs/skull.gif';


const store = useStore();
const props = defineProps(['visible']);
function handleLeave(){
  store.exitGame();
}
</script>
<template>

  <el-dialog
      v-model="props.visible"
      title="Mais sorte na próxima vez"
      width="100%"
      destroy-on-close
      center
      fullscreen
      custom-class="death-screen"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    <el-row justify="center">
      <h1>Você morreu</h1>
    </el-row>
    <el-row>
      <img :src="gifSkull" />
    </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="large" plain effect="dark" type="default" @click="handleLeave">Sair</el-button>
        </span>
      </template>
  </el-dialog>
</template>

<style lang="scss">
.death-screen{
  background-color: black !important;
  img{
    width: 100%;
  }
}
</style>