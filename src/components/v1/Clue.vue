<script lang="ts" setup>
import Modal from '../common/Modal.vue';

const props = defineProps(['visible', 'cell']);
</script>

<template>
<Modal :visible="props.visible">
  <div slot="header">
    <h2>{{props.cell?.x}} - {{props.cell?.y}}</h2>
  </div>
  <div slot="body">
    <p>
      {{props.cell.clue}}
    </p>
  </div>
</Modal>
</template>