<script lang="ts" setup>
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { createGameSession } from '../api/scripts';
import { useStore } from '../store/appStore';
import { TypeCampaing } from '../types/api';

const props = defineProps(['campaings']);
const gameCampaings = props.campaings as TypeCampaing[];

const showIngputPlayerCount = ref(false);
const selectedCampaing = ref({} as TypeCampaing);
const store = useStore();

async function handleCampaingClick(campaing: TypeCampaing){
  selectedCampaing.value = campaing;
  showIngputPlayerCount.value = true;
}
async function handleChoosePlayerCount(playerCount: number){
  const response = await createGameSession({
    id_campaign: selectedCampaing.value.id,
    player_count: playerCount
  });
  store.createSession(response);
}

</script>
<template>
<h1>Selecione a Campanha</h1>
<el-row>
  <el-col :xs="24">
    <el-card 
      @click="handleCampaingClick(c)"
      class="icon-campaing" 
      v-for="(c, i) of gameCampaings" :key="i" 
      :style="{'background': `url(${c.urlImage})`, 'background-size': 'cover'}">
    <el-row alignment="middle" >
      <h2>{{c.name}}</h2>
    </el-row>
    </el-card>
  </el-col>
</el-row>
<el-dialog v-model="showIngputPlayerCount"  class="input-player"
  title="Quantos jogadores irão jogar?" width="95%" center>
  <h2><b>Campanha:</b> {{selectedCampaing.name}}</h2>
    <el-row justyfi="right">
      <el-col :xs="8" v-for="(item, i) in 9" :key="i">
        <el-row justify="center">
          <el-button @click="handleChoosePlayerCount(item)" class="btn-input-player" type="warning" size="large">
            {{item}}
          </el-button>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-card{
  background-size: cover;
}
.icon-campaing, .el-card__body{
  background-size: cover;
  text-shadow: 0px 0px 10px #000000;
  color: white;
  cursor: pointer;
}
.btn-input-player{
  margin-top: 20px;
  font-size: 28px;
  padding: 22px;
}
</style>

<style lang="scss">
.input-player{
  background-color: #242424;
  color: white;
}
</style>