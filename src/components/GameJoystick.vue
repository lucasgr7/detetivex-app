<script lang="ts" setup>
import { useStore } from '../store/appStore';


const store = useStore();
const emits = defineEmits(['accuse', 'investigate', 'options']);
</script>

<template>
  <div class="affix joystick" position="button">
    <el-row align="middle">
      <el-col class="accuse-button" :xs="8" >
        <el-button class="button" @click="emits('accuse')">
          Acusar
        </el-button>
      </el-col>
      <span class="separator">&#124;</span>
      <el-col :xs="8">
        <el-button :disabled="store.lastPlayerInvestigate" class="button" @click="emits('investigate')">
          Investigar
        </el-button>
      </el-col>
      <span class="separator">&#124;</span>
      <el-col :xs="4">
        <el-button class="button" @click="emits('options')">
          ...
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.affix {
  cursor: pointer;
  position: fixed;
  width: 100%;
  bottom: -10px;
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