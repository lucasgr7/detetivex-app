<script lang="ts" setup>
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
import { postStartAccusation } from '../api/scripts';
import { useStore } from '../store/appStore';
import { Player } from '../types/api';
import ListPlayers from './ListPlayers.vue';

const props = defineProps(['showAccusation']);
const emits = defineEmits(['close']);
const store = useStore();
const playerSelected = ref();

// actions
function handleUserSelected(player: Player){
  playerSelected.value = player;
}
async function handleConfirm(){
  if(!playerSelected.value){
    ElNotification({
      type: 'warning',
      message: 'Selecione um jogador'
    });
    return;
  }
  await postStartAccusation(store.hash, playerSelected.value.hash, store.gameSession.id);
  emits('close');
}
function handleAusent(){
  emits('close');
}
</script>
<template>
  <el-dialog
      v-model="props.showAccusation"
      title="acuse um jogador"
      width="100%"
      destroy-on-close
      center
      fullscreen
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    Acusando: {{playerSelected?.name}}
    <ListPlayers 
      @selected="handleUserSelected"
      :players="store.everyoneButMe" 
      :columns="96" 
      :hide-header="true"
      :font-size="22"
      :selection="true"></ListPlayers>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="large" plain effect="dark" type="default" @click="handleAusent">agora não</el-button>
          <el-button size="large" plain effect="dark" type="danger" @click="handleConfirm">Confirmar</el-button>
        </span>
      </template>
  </el-dialog>
</template>