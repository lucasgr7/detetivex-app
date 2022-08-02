<script lang="ts" setup>
import _ from 'lodash';
import { computed, onMounted, ref } from 'vue';
import { useStore } from '../store/appStore.js';
import type { TypePlayerAttribute } from '../types/api.js';
import GameButton from './common/GameButton.vue';

interface AttributeSelection extends TypePlayerAttribute {
  selected?: Boolean;
}

const store = useStore();
const props = defineProps(['visible']);
const limit = ref(4);
const visible = ref(true);
const emits = defineEmits(['close']);
const attributes = ref([] as AttributeSelection[]);

// animations
const isRandomizing = ref(false);

function handleRandomize(): void{
  if(limit.value <= 0) return;

  if(limit.value <= 3) isRandomizing.value = true;

  attributes.value.map(x => x.selected = false);

  setTimeout(() => {
    const randomAttributes = _.shuffle(store.attributes);
    const options = randomAttributes.slice(0, 5);
    options.push({id: 0, name: 'Nenhuma', points: 0});
    attributes.value = options;
    limit.value--;
    isRandomizing.value = false;
  }, isRandomizing.value ? 1500 : 0);
}
const playerMessage = computed(() => {
  return `Seu personagem será: ${attributes.value
    .filter(x => x.selected)
    .map(x => x.name).join(', ')}`;
})
function handleSelectAttribte(item: AttributeSelection): void {
  item.selected = !item.selected;
}
function handleConfirm() {

}
onMounted(() => {
  handleRandomize();
})
</script>

<template>
  <el-dialog v-model="visible" 
    title="Selecione suas características" 
    width="100%"
    @close="emits('close')"
    destroy-on-close center fullscreen
    :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row v-show="playerMessage.length > 0" class="message">
      {{playerMessage}}
    </el-row>
      <el-card 
        class="option-attribute animate__animated"
        :class="{'animate__heartBeat': item.selected, 'animate__backOutLeft': isRandomizing, 'animate__fadeInDown': !isRandomizing}"
        v-for="(item, i) of attributes" :key="i"
        @click="handleSelectAttribte(item)">
        <el-row>
          {{item.name}}
        </el-row>
        <el-row v-if="item.points !== null" class="points">
          Te dará:&MediumSpace;
          <span>{{item.points}} 
            GP<span v-if="item.points > 1">s</span>
          </span>
        </el-row>
      </el-card>
      <el-row class="option-attribute" justify="space-between">
        <GameButton @click="handleConfirm" type="success">
          Confirmar
        </GameButton>
        <GameButton @click="handleRandomize" :type="limit > 0 ? 'info' : 'danger'">
          Sortear novamente ({{limit}})
        </GameButton>
      </el-row>
      <el-row class="option-attribute" justify="end">
      </el-row>
  </el-dialog>
</template>

<style lang="scss" scoped>
.message{
  font-size: 22px;
  line-height: 22px;
  color: #7a5ad1;
}
.option-attribute{
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 24px;
  &.animate__heartBeat{
    color: yellow;
  }
  .points{
    margin-top: 10px;
    font-size: 18px;
    span{
      color: green;
    }
  }
}
</style>