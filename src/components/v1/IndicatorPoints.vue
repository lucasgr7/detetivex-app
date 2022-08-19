<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Star } from '@element-plus/icons-vue'
import { useStoreV1 } from '../../store/appV1Store';

const store = useStoreV1();
const value = ref(store.myPoints)

watch(() => store.myPoints, () => {
  value.value = store.myPoints
})
</script>

<template>
<el-rate
    v-model="value"
    :max="10"
    :disabled="true"
    :show-score="true"
    :colors="['#e6f7ea', '#dff9ee', '#13ce66']"
  />
</template>

//  scales of green color
<style lang="scss">

</style>