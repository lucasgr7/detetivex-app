<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { TypeReveal } from '../../types/gamev1';
import Modal from '../common/Modal.vue';


const props = defineProps({
  visible: Boolean,
  reveal: Object as PropType<TypeReveal>
});
const emits = defineEmits(['close'])

const image = computed(() => {
  return new URL(props.reveal?.image ?? '', import.meta.url).href
})

</script>
<template>
<Modal :visible="props.visible" 
  :fullscreen="true"
  @close="emits('close')"
  >
  <el-main id="reveal">
    <el-row justify="center">
      <img :src="image" alt="">
    </el-row>
    <el-row justify="center">
      <h2>
        <span v-if="props.reveal?.hasClue" class="clue">
          Dica:
        </span>
        {{props.reveal?.text}}
      </h2>
    </el-row>
    <el-row justify="end">
      <el-button @click="emits('close')" >
        Fechar
      </el-button>
    </el-row>
  </el-main>
</Modal>
</template>

<style lang="scss" scoped>
#reveal{
  // image with round borders
  img{
    border-radius: 10px;
    width: 100%;
    height: 100%;
  }
  .clue{
    font-weight: bold;
    // light blue color
    color: rgb(0, 207, 226);
  }
}
</style>