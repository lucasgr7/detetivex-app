<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import type { TypeMap, TypeCell, TypePlayerV1 } from '../../types/gamev1.js';

const props = defineProps(['visible', 'player']);

const infoPlayer = ref({} as TypePlayerV1);

// function returns background for the player color in gradient
function getPlayerColor(player: TypePlayerV1) {
  return `background: linear-gradient(to bottom, ${player.color} 0%, #fff 100%)`;
}

const itens = computed(() => {
  return [...props.player.objects, ...props.player.weapons];
})
</script>

<template>
  <el-dialog v-model="props.visible" id="base-player-info" fullscreen :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-main>
      <el-card id="player-info">
        <el-row justify="start">
          <el-col :xs="16">
          <el-row justify="start">
            <h2 id="title-file">Ficha de {{props.player.name}}</h2>
          </el-row>
          </el-col>
          <el-col :xs="8">
          <el-row justify="end">
            <div :style="getPlayerColor(props.player)" class="player-color">
              <!--  centered  -->
              <span id="question-mark">
                ???
              </span>
            </div>
          </el-row>
          </el-col>
          <!-- round div with the player color as background -->
        </el-row>
          <hr/>
        <el-row justify="center">
          Pertences
        </el-row>
        <hr/>
        <el-row>
          <el-row class="player-itens">
            <el-col :span="24" v-for="(item, i) of itens" :key="i">
              <el-row>
                <el-col class="col-button" :xs="4">
                  <el-button class="reaveal-button" type="primary" @click="emits('reveal-item', item)">
                    <el-icon>
                      <Search />
                    </el-icon>
                  </el-button>
                </el-col>
                <span>{{ item.name }}</span>
              </el-row>
            </el-col>
          </el-row>
        </el-row>
      </el-card>
    </el-main>
  </el-dialog>
</template>

<style lang="scss">
.el-dialog.is-fullscreen{
    backdrop-filter: blur(6px) saturate(151%);
    -webkit-backdrop-filter: blur(6px) saturate(151%);
    background-color: rgba(17, 25, 40, 0.53);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
}</style>
<style lang="scss" scoped>
#player-info {
  // background color gradient of brown and white with opacity 0.5
  background-image: linear-gradient(to bottom, #473b3b 0%, rgb(54, 49, 49) 100%);
  #title-file {
    font-size: 1.2em;
    font-weight: bold;
    // use a misterious font-family to avoid the text to be cutted in the middle of the word 
    font-family: 'FontAwesome';
    // use the icon of a search to show the item is hidden
    font-size: 1.5em;
    z-index: 9999 !important;
  }

  margin-bottom: 20px;
  font-size: 2.0em;
  border: solid 4px #00bcd4;
  border-color: #473f3f;


  span {
    font-size: 2.0em;
  }

  .player-color {
    width: 100px;
    height: 100px;
    border-radius: 20%;
    padding: 00px;
    margin: 10px;

    #question-mark {
      // centered
      transform: translate(-50%, -50%);
      margin-top: 28px;
      margin-left: -27px;
      position: absolute;

      animation: blink 1s infinite;

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
    .el-col {
      padding: 0px;
      margin: 0px;
      margin-right: 10px;
      margin-bottom: 10px;
      font-size: 0.5em;
.col-button{
  .reaveal-button {
    // a round button with icon of a search to reveal the item opacity. 0.5
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-right: 20px;
    line-height: 50px;
    text-align: center;
    font-size: 24px;
    opacity: 0.5;
    transition: opacity 0.5s;
    &:hover {
      opacity: 1;
      // should rotate 360 degrees
      transform: rotate3d(0, 0, 1, 360deg);
    }
  }

}
    }

  }
}
</style>