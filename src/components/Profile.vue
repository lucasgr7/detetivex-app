<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useStore } from '../store/appStore';

const visible = ref(true);
const type = computed(() => {
  return store.myPlayer.is_killer ? 'Assassino' : 'Vítima'
})
const buttonHideLabel = computed(() => {
  if(visible.value){
    return 'Ocultar'
  }
  return 'Mostrar'
})
const quircks = computed(() => {
  return store.myAttributes?.map(x=> x.name).join(", ");
})
const store = useStore();

</script>
<template>
  <el-card class="profile">
    <template #header>
      <el-row class="title" justify="space-between">
        <el-col :xs="8">
          Seu Perfil
        </el-col>
        <el-col :xs="8" style="color: white" @click="visible = !visible">
            {{buttonHideLabel}}
        </el-col>
      </el-row>
    </template>
    <div v-if="store.myPlayer && visible">
      <el-row>
        <el-col :xs="16">
          <el-row>
            <label>Nome</label>&ThickSpace;{{ store.myPlayer?.name }}
          </el-row>
        </el-col>
        <el-col style="color: red" :xs="8">
          <el-row justify="end">
            {{ type }}
          </el-row>
        </el-col>
      </el-row>
      <el-row v-if="store.suspect?.who != null">
        <label>Suspeita de</label>&ThickSpace;<span style="color: red">{{ store.suspect?.who?.name }}</span>
      </el-row>
      <el-row v-else>
        <label>Suspeita de</label>&ThickSpace;Ninguém
      </el-row>
      <hr/>
      <el-row v-if="store.myAttributes?.length > 0" class="quircks" justify="center">
        <label class="title">Caracteristicas:</label>
        <span class="result">{{quircks}}</span>
      </el-row>
    </div>
    <div v-else>
      ...
    </div>
  </el-card>
</template>

<style lang="scss">
.el-card.is-always-shadow.profile {
  margin-top: 15px;
  border-width: 1px;
  border-style: solid;
  box-sizing: border-box;
  border-color: #3e6b27;
  box-shadow: 0px 0px 12px rgba(3, 97, 0, 0.72);

  .title {
    color: #53fa00;
  }

  label {
    color: gray;
  }

  .el-row {
    margin-top: 10px;
  }
  .result{
    margin-left: 5px;
  }
  .quircks{
    .title{
      margin-bottom: 20px;
    }
    margin-top: 20px;
    line-height: 20px;
  }
}
</style>