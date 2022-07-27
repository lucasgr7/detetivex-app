<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useStore } from '../store/appStore';

const visible = ref(true);
const buttonHideLabel = computed(() => {
  if(visible.value){
    return 'Ocultar'
  }
  return 'Mostrar'
})
const store = useStore();

</script>
<template>
  <el-card class="narrative">
    <template #header>
      <el-row class="title" justify="space-between">
        <el-col :xs="8">
          Narrativa
        </el-col>
        <el-col :xs="8" style="color: white" @click="visible = !visible">
            {{buttonHideLabel}}
        </el-col>
      </el-row>
    </template>
    <div v-if="store.myPlayer && visible">
    <el-row class="narrative-text">
      {{store.campaing?.narrative}}
    </el-row>
    <div v-if="store.suspect.who != null">
      <hr/>
      <el-row >
        <label>Sua suspeita:</label>
        <span class="suspect-detail">
          <span class="name">
            {{store.suspect?.who.name}}
          </span>
          {{store.suspect?.details}}
        </span>
      </el-row>
    </div>
    </div>
    <div v-else>
      ...
    </div>
  </el-card>
</template>

<style lang="scss">
.el-card.is-always-shadow.narrative {
  margin-top: 15px;
  border-width: 1px;
  border-style: solid;
  box-sizing: border-box;
  border-color: #ffffff;
  box-shadow: 0px 0px 12px rgba(155, 155, 155, 0.72);

  .narrative-text{
    line-height: 20px;
  }

  .title {
    color: #ffa600;
  }

  label {
    color: gray;
  }

  .el-row {
    margin-top: 10px;
  }
  .suspect-detail{
    margin-left: 5px;
    .name{
      color: rgb(255, 141, 141);
    }
  }
}
</style>