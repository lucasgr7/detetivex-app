<script lang="ts" setup>
import { ElNotification } from 'element-plus';
import { onMounted, ref, watch, computed } from 'vue';
import { postInvestigation } from '../api/scripts';
import { useStore } from '../store/appStore';
import { Player } from '../types/api';
import { Investigation } from '../types/campaing';
import ListPlayers from './ListPlayers.vue';

const STATE_SELECT_SCENARIO = 1, STATE_SELECT_GROUP = 2;

const props = defineProps(['showInvestigation']);
const emits = defineEmits(['close', 'start']);
const store = useStore();
const scenarioSelected = ref();
const playersSelected = ref([] as Player[]);
const state = ref(STATE_SELECT_SCENARIO)
const title = ref('Selecione onde investigar');


watch(() => state.value, () => {
  if (state.value === STATE_SELECT_GROUP) {
    title.value = 'Selecione quem vai com você'
  }
  else if (state.value === STATE_SELECT_SCENARIO) {
    title.value = 'Selecione onde investigar'
  }
})
const scenarios = computed(() => {
  return store.campaing?.investigations
})

// actions
function handleClickScenario(scenario: Investigation) {
  scenarios.value.forEach(x => x.selected = false);
  scenario.selected = true;
  scenarioSelected.value = scenario;
}
async function handleConfirm() {
  if (!scenarioSelected.value) {
    ElNotification({
      message: 'Selecione um cenário, duh',
      type: 'warning'
    });
    return;
  }
  if (state.value === STATE_SELECT_SCENARIO) {
    state.value = STATE_SELECT_GROUP;
  }
  else if (state.value === STATE_SELECT_GROUP) {
    if (playersSelected.value?.length < 2) {
      ElNotification({
        message: 'Precisa de 2 jogadores para irem com vc',
        type: 'warning'
      });
      return;
    }
    playersSelected.value.push(store.myPlayer);
    await postInvestigation(scenarioSelected.value.id, playersSelected.value.map(x => x.hash), store.gameSession.id);
    store.addLastInvestigator();
    handleAusent();
  }
}
function handleAusent() {
  playersSelected.value = [];
  scenarioSelected.value = null;
  state.value = STATE_SELECT_SCENARIO;
  emits('close');
}
function handleUserSelected(players: any) {
  playersSelected.value = players;
}

// mounted
onMounted(() => {;
  playersSelected.value = [];
  scenarioSelected.value = null;
  state.value = STATE_SELECT_SCENARIO;
})
</script>
<template>
  <el-dialog v-model="props.showInvestigation" :title="title" width="100%" destroy-on-close center fullscreen
    :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div v-if="state === STATE_SELECT_SCENARIO">

      <el-card class="scenario" v-for="(item, i) of scenarios" :key="i" :class="{ 'selected': item.selected == true }"
        @click="handleClickScenario(item)">
        {{ item.name }}
      </el-card>
    </div>
    <div v-else>
      <el-row>
        <label class="label-title">Investigação</label>
      </el-row>
      <el-row>
        {{ scenarioSelected.name }}
      </el-row>
      <el-row class="margin-top">
        <label class="label-title">Seu time</label>
      </el-row>
      <el-row justify="center">
        <el-tag type="danger" class="tag-user-selected" v-for="(item, i) of playersSelected" :key="i">
          {{ item.name }}
        </el-tag>
      </el-row>
      <ListPlayers @selected="handleUserSelected" :players="store.everyoneButMe" :columns="96" :hide-header="true"
        :font-size="22" :selection="true" :max-selection="2"></ListPlayers>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="large" plain effect="dark" type="default" @click="handleAusent">Desisto</el-button>
        <el-button size="large" plain effect="dark" type="danger" @click="handleConfirm">Vamos la!</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.scenario {
  margin-top: 10px;

  &.selected {
    color: #f56c6c;
    background-color: #2b1d1d;
    border-color: #f56c6c;
  }
}

label.label-title {
  background: white;
  padding: 5px;
  color: black;
  border-radius: 5px;
}
</style>
<style lang="scss">
.tag-user-selected {
  margin-right: 12px;
  font-size: 25px;
}

.margin-top {
  margin-top: 20px;
}
</style>