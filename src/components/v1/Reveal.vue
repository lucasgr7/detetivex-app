<script lang="ts" setup>
import { computed, PropType, watch } from 'vue';
import { TypeReveal } from '../../types/gamev1';
import Modal from '../common/Modal.vue';
import { useStoreV1 } from '../../store/appV1Store.js';

const store = useStoreV1();
const props = defineProps({
  visible: Boolean,
  reveal: Object as PropType<TypeReveal>
});
const emits = defineEmits(['close'])

const image = computed(() => {
  return new URL(props.reveal?.image ?? '', import.meta.url).href
});

watch(() => props.reveal, () => {
  if(!props.reveal?.text) return;
  if(props.reveal?.hasClue)
    store.saveReavealedClue(props.reveal?.text);
});

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