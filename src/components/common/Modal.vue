<script lang="ts" setup>


const props = defineProps(['visible', 'forced', 'fullscreen', 'title']);
</script>

<template>

  <el-dialog v-model="props.visible" 
    :fullscreen="props.fullscreen"
    :close-on-click-modal="!props.forced"
    :close-on-press-escape="!props.forced"
    :show-close="!props.forced"
    :title="props.title"
    id="modal"
    style="width: 100%"
    >
    <el-main>
      <slot>
        <el-empty></el-empty>
      </slot>
    </el-main>
  </el-dialog>
  </template>

<style lang="scss" scoped> 
  #modal.el-dialog.is-fullscreen{
    border-radius: 0px;
  }
</style>