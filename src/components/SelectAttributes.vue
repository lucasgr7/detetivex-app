<script lang="ts" setup>
import _ from 'lodash';
import { computed, onMounted, ref } from 'vue';
import { useStore } from '../store/appStore.js';
import type { TypePlayerAttribute } from '../types/api.js';
import GameButton from './common/GameButton.vue';
import GameButton1 from './common/GameButton.vue';

interface AttributeSelection extends TypePlayerAttribute {
  selected?: Boolean;
}

const props = defineProps(['visible', 'attributes']);
const emits = defineEmits(['close', 'selected']);
const limit = ref(4);
const visible = ref(true);
const attributes = ref([] as AttributeSelection[]);

// animations
const isRandomizing = ref(false);
function handleRandomize(): void {
  if (limit.value <= 0) return;

  if (limit.value <= 3) isRandomizing.value = true;

  attributes.value.map(x => x.selected = false);

  const randomAttributes = _.shuffle(props.attributes);
  const options = randomAttributes.slice(0, 5);
  options.push({ id: 0, name: 'Nenhuma', points: 0 });
  attributes.value = options;
  limit.value--;
  isRandomizing.value = false;
}
const playerMessage = computed(() => {
  return `Seu personagem será: ${attributes.value
    .filter(x => x.selected)
    .map(x => x.name).join(', ')}`;
})
function handleSelectAttribte(item: AttributeSelection): void {
  item.selected = !item.selected;
  emits('selected', attributes.value.filter(x => x.selected));
}

onMounted(() => {
  handleRandomize();
})
</script>

<template>
  <el-main>
    <el-row v-show="playerMessage.length > 0" class="message">
      {{ playerMessage }}
    </el-row>
    <el-row class="option" v-for="(item, i) of attributes" :key="i">
      <el-card class="option-attribute animate__animated"
        :class="{ 'animate__heartBeat': item.selected, 'animate__backOutLeft': isRandomizing, 'animate__fadeInDown': !isRandomizing }"
        @click="handleSelectAttribte(item)">
        <el-row>
          {{ item.name }}
        </el-row>
        <el-row v-if="item.points !== null" class="points">
          <span>{{ item.points }}
            GP<span v-if="item.points > 1">s</span>
          </span>
        </el-row>
      </el-card>
    </el-row>
    <el-row style="height: 30px" justify="space-between">
      <el-button style="width: 100%" type="warning" @click="handleRandomize">
        Quero outros (Tentativas {{ limit }})
      </el-button>
    </el-row>

  </el-main>
</template>

<style lang="scss" scoped>
.message {
  font-size: 12px;
  line-height: 22px;
  color: #7a5ad1;
}

.option {
  width: 100%;

  .el-card {
    width: 100%;
    padding: 0px;

    .el-card__body {
      .el-row {
        margin: 0px;
        padding: 0px;
      }
    }
  }
}

.option-attribute {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 18px;

  &.animate__heartBeat {
    color: yellow;
  }

  .points {
    margin-top: 10px;
    font-size: 18px;

    span {
      color: green;
    }
  }
}
</style>