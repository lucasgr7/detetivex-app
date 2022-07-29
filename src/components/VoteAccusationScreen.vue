<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { postAccusation } from '../api/scripts';
import { useStore } from '../store/appStore';


const store = useStore();
const visible = ref(false);
const props = defineProps(['visible'])


const involvedPeople = computed(() => {
  if(store.gameSession.accusations?.length > 0){
    const accusation = store.gameSession.accusations[store.gameSession.accusations?.length - 1];
    const accused = store.gameSession.players.filter(x => x.hash === accusation.hash_accused)[0]
    const accuser = store.gameSession.players.filter(x => x.hash === accusation.hash_accuser)[0]
    return {
      accused, accuser
    }
  }
  return {
    
  }
})

function handleConfirm(){
  postAccusation(store.myPlayer.hash, store.gameSession.id, true);
  store.iVoted = true;
}
function handleAusent(){
  postAccusation(store.myPlayer.hash, store.gameSession.id, false);
  store.iVoted = true;
}

</script>
<template>
  <el-dialog
      v-model="props.visible"
      title="Jogador está sendo acusado"
      width="100%"
      destroy-on-close
      center
      fullscreen
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
     <span style="color: pink">{{involvedPeople.accuser?.name}}</span> 
      está acusando que 
      <span style="color: pink">{{involvedPeople.accused?.name}}</span> é o assassino
      <template #footer>
        <span class="dialog-footer" v-if="!store.iVoted">
          <el-button size="large" plain effect="dark" type="default" @click="handleAusent">Não é</el-button>
          <el-button size="large" plain effect="dark" type="danger" @click="handleConfirm">É sim</el-button>
        </span>
        <span class="dialog-footer" v-else>
          <h4>Aguardando os outros jogadores...</h4>
        </span>
      </template>
  </el-dialog>
</template>