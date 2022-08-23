<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import Modal from '../common/Modal.vue';
import SelectAttributes from '../SelectAttributes.vue';
import { __mock_attributes__ } from '../../mocks/attributes.ts';
import { TypePlayerV1 } from '../../types/gamev1';
import { ElNotification } from 'element-plus';
import { random } from '../../helpers/functions';

const props = defineProps(['visible', 'forced', 'fullscreen']);
const emits = defineEmits(['created']);
const player = reactive({} as TypePlayerV1);
const isLoading = ref(false);


const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b', '#000000', '#ffffff'];
// function that returns 8 random colors without repeating
function getRandomColors() {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b', '#000000', '#ffffff'];
  const colorsArray = [];
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    colorsArray.push(colors[randomIndex]);
    colors.splice(randomIndex, 1);
  }
  return colorsArray;
}

function handleAttributesSelected(attributes: any) {
  player.personality = attributes;
}

function handleFinalize(){
  if(!player.name){
    ElNotification({
      title: 'Error',
      message: 'Você precisa ter um nome',
      type: 'error'
    });
    return;
  }
  isLoading.value = true;
  setTimeout(() => {
    emits('created', player)
    isLoading.value = false;
  }, random(10) * 1000)
}

const freeColors = computed(() => {
  return getRandomColors();
})
</script>

<template>
  <Modal :visible="props.visible" :forced="true" :fullscreen="true" title="Crie seu jogador" :loading="isLoading">
    <el-main id="create-player-modal-body" 
      :style="`border-top: 1px solid ${player.color} !important;` ">
        <el-form-item label="Nome" >
          <el-input type="text" v-model="player.name" placeholder="Nome do jogador"></el-input>
        </el-form-item>
        <!-- presents 8 buttons with collors to choose from -->
        <el-form-item label="Cor">
          <el-button-group>
            <el-button v-for="(color, i) of freeColors" :key="i" type="info" @click="player.color = color"
              :style="`background-color: ${color}`">
              <el-icon>
                <Cirle />
              </el-icon>
            </el-button>
          </el-button-group>
        </el-form-item>
        <SelectAttributes @selected="handleAttributesSelected" :attributes="__mock_attributes__"></SelectAttributes>
        <el-button type="success" @click="handleFinalize">
          Finalizar
        </el-button>
    </el-main>
  </Modal>
</template>

<style lang="scss" scoped>
#create-player-modal-body {
  padding: 5px;
}
</style>