<script lang="ts" setup>
import { ElNotification } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import { useStoreV1 } from '../../store/appV1Store';
import type { TypePlayerV1 } from '../../types/gamev1.js';
import { GAME_SETTINGS } from "../../settings";

const props = defineProps(['visible', 'player']);
const emits = defineEmits(['reveal', 'close']);
const store = useStoreV1();

const infoPlayer = ref({} as TypePlayerV1);

// function returns background for the player color in gradient
function getPlayerColor(player: TypePlayerV1) {
  return `background: linear-gradient(to bottom, ${player.color} 0%, rgb(0 255 223) 100%)`;
}

// function emits when user reveal hits 100
function handleReveal(item: any) {
  if (store.myPoints <= 1) {
    ElNotification({
      title: 'Sem pontos suficientes',
      message: 'Você não tem pontos suficientes para revelar',
      type: 'error',
    });
    item.unlock = 0;
    return;
  }
  if (item.unlock === 100) {
    debugger;
    store.unlockPersonInfo(item);
  } else {
    item.unlcok = 0;
  }
}

const hasEnoughPoints = computed(() => {
  return store.myPoints >= GAME_SETTINGS.POINTS_EXPENSE.REVEAL_PLAYER_ITEM
});
const itens = computed(() => {
  const allItens = [...props.player.objects, ...props.player.weapons];
  const isMyItens = props.player.hash === store.myPlayer?.hash;
  allItens.forEach(x => {
    x.playerHash = props.player.hash
    if(isMyItens)
      x.unlock = 100;
  });
  if(isMyItens){
    return allItens;
  }
  allItens.forEach((item: any) => {
    store.cluesRevealed
      .filter(x => x.playerHash === props.player.hash)
      .map((x: any) => x.id)
      .includes(item.id) ? item.unlock = 100 : item.unlock = 0;
  });
  return allItens;
})
</script>

<template>
  <el-dialog v-model="props.visible" id="base-player-info" fullscreen 
    :close-on-click-modal="false"
    @close="emits('close')"
    :close-on-press-escape="false">
    <el-main>
      <el-card id="player-info">
        <el-row class="first-row" justify="start">
          <el-col :xs="16">
            <el-row justify="start" align="middle" id="title-file">
              Ficha de {{ props.player.name }}
            </el-row>
          </el-col>
          <el-col :xs="8">
            <el-row justify="end">
              <div :style="getPlayerColor(props.player)" class="player-color">
                <!--  centered  -->
                <span id="question-mark">
                  ?
                </span>
              </div>
            </el-row>
          </el-col>
          <!-- round div with the player color as background -->
        </el-row>
        <div justify="end" class="personality">
          {{ props.player.personality.map(x => x.name).join(', ') }}
        </div>
        <el-row style="margin-top: 20px" justify="center">
          Pertences
        </el-row>
        <hr />
        <el-row>
          <el-main class="player-itens">
            <el-row :span="24" v-for="(item, i) of itens" :key="i">
              <div v-if="item.unlock < 100 || !item.unlock" style="width: 100%; padding: 0px 10px 0px 10px;">
                <span 
                  v-if="hasEnoughPoints" 
                  class="demonstration">Arraste para decobrir</span>
                <span v-else class="demonstration has-no-points">Sem pontos suficientes</span>
                <el-slider :disabled="!hasEnoughPoints" v-model="item.unlock" @input="handleReveal(item)" />

              </div>
              <span v-else>{{ item.name }}</span>
            </el-row>
          </el-main>
        </el-row>
      </el-card>
    </el-main>
  </el-dialog>
</template>

<style lang="scss">
.el-dialog.is-fullscreen {
  backdrop-filter: blur(6px) saturate(151%);
  -webkit-backdrop-filter: blur(6px) saturate(151%);
  background-color: rgba(17, 25, 40, 0.53);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.125);
}
</style>
<style lang="scss" scoped>
$--el-color-primary: white;

#player-info {
  // background color gradient of brown and white with opacity 0.5
  background-image: linear-gradient(to bottom, #473b3b 0%, rgb(54, 49, 49) 100%);

  font-family: monospace;

  #title-file {
    font-size: 21px;
    font-weight: bold;
    //alignment middle
    margin-top: 20px;
    color: #fff;
  }

  .el-row:first-child {
    margin-bottom: 10px;
  }

  .first-row {
    margin-bottom: -20px;
  }

  .personality {
    color: #9e9e9e;
  }

  margin-bottom: 20px;
  font-size: 1.3em;
  border: solid 4px #00bcd4;
  border-color: #473f3f;


  span {
    font-size: 2.0em;
  }

  .player-color {
    width: 60px;
    height: 60px;
    border-radius: 10%;
    padding: 00px;
    margin: 00px;

    #question-mark {
      // centered
      transform: translate(-50%, -50%);
      margin-top: 16px;
      margin-left: -9px;
      position: absolute;
      animation: blink 2s infinite;
      font-size: 45px;
      font-family: parent;

      @keyframes blink {
        0% {
          opacity: 1;
          transform: rotate3d(0, 0, 1, 0deg);
        }

        50% {
          opacity: 1;
          transform: rotate3d(0, 1, 1, 10deg);
        }

        100% {
          opacity: 1;
          transform: rotate3d(0, 0, 1, 0deg);
        }
      }
    }
  }

  .player-itens {
    width: 100%;
    color: rgb(142, 142, 0);

    .el-row {
      padding: 0px;
      margin: 0px;
      margin-right: 10px;
      margin-bottom: 10px;
      font-size: 0.5em;
    }

    .demonstration {
      margin-top: 0px;
      width: 90%;
      margin-left: 10px;
      left: 0;

      //font glowing green effect
      color: #00d463;
      text-shadow: 0 0 10px #00bcd4;

      &.has-no-points {
        color: #ff3535;
        text-shadow: 0 0 10px #ff614c;
      }
    }

  }
}
</style>