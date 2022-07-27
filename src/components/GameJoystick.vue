<script lang="ts" setup>

const emits = defineEmits(['accuse', 'investigate', 'options'])
</script>

<template>
  <div class="affix" position="button">
    <el-row>
      <el-col class="accuse-button" :xs="10" >
        <el-button class="button" @click="emits('accuse')">
          Acusar
        </el-button>
      </el-col>
      <span class="separator">&#124;</span>
      <el-col :xs="10">
        <el-button class="button" @click="emits('investigate')">
          Investigar
        </el-button>
      </el-col>
      <el-col :xs="2">
        <span class="button" @click="emits('options')">
          ...
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.affix {
  cursor: pointer;
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #dedede;
  padding: 12px;
  .button{
    color: gray;
  }
  .accuse-button{
    height: 100%;
  }

  .separator {

  }
}
</style>