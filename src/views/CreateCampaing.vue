<script lang="ts" setup>
import _ from 'lodash';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createGameSession } from '../api/scripts';
import { useStore } from '../store/appStore';
import { TypeCampaing } from '../types/campaing';

const store = useStore();
const router = useRouter();
const gameCampaings = store.campaings;

const showIngputPlayerCount = ref(false);
const selectedCampaing = ref({} as TypeCampaing);

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
  router.replace('/v0/' + store.gameSession.id)
}
onMounted(() => {
  store.loadAllCampaings();
})
</script>
<template>
<div class="create-campaing">
  <h1>DetetiveX</h1>
  <el-row>

  </el-row>
  <h2>Selecione a Campanha </h2>
  <el-row>
    <el-col :xs="24">
      <el-card 
        @click="handleCampaingClick(c)"
        class="icon-campaing" 
        v-for="(c, i) of gameCampaings" :key="i" 
        :style="{'background': `url(${c.url_image})`, 'background-size': 'cover'}">
      <el-row alignment="middle" >
        <h3>{{c.name}}</h3>
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
</div>
</template>

<style lang="scss">
.create-campaing{
  color: white;
  h1{
    font-size: 40px;
  }
  h2{
    font-size: 34px;
  }
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
}
.input-player{
  background-color: #242424;
  color: white;
}
</style>