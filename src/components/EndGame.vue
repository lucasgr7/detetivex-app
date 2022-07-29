<script lang="ts" setup>
import { useStore } from '../store/appStore';
import victory from '../assets/gifs/victory.gif';
import loser from '../assets/gifs/loser.gif';
import { computed, ref } from 'vue';


const store = useStore();
const props = defineProps(['visible']);
const isAssassinVictory = ref(false);
const isVictimVictory = ref(false);
function handleLeave(){
  store.clearGameSession();
}

const isWinner = computed(() => {
  const killersAlive = store.gameKillers;
  const victimsAlive = store.gameVictims;
  const killerWin = killersAlive.length >= victimsAlive.length
  if(killerWin){
    isAssassinVictory.value = true;
    return store.myPlayer?.is_killer == true ? true : false;
  }
  else{
    return isVictimVictory.value = true;
    return store.myPlayer?.is_killer == false ? true : false;
  }
})

</script>
<template>

  <el-dialog
      v-model="props.visible"
      title="Fim de jogo"
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
      <h1 style="color: green" v-if="isWinner">Você venceu!</h1>
      <h1 style="color: pink" v-else>Você perdeu!</h1>
    </el-row>
    <el-row justify="center">
      <h2 v-if="isAssassinVictory">Vitória dos assassinos, que dominaram todas as vitimas</h2>
      <h2 v-if="isVictimVictory">Vitória das vítimas que pegaram todos os asassinos</h2>
    </el-row>
    <el-row justify="center">
      <h3 style="color: red">Assassinos do jogo:</h3>
    </el-row>
    <el-row justify="center" v-for="(item, i) of store.gameKillersDOA" :key="i">
      <h2>
        {{item.name}}
      </h2>
    </el-row>
    <el-row>
      <img v-if="isWinner" :src="victory" />
      <img v-else :src="loser" />
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