<script lang="ts" setup>
import { computed, ref } from "vue";
import PlayerInfo from "./PlayerInfo.vue";

const props = defineProps(['player', 'isMyPlayer', 'style']);
const showPlayerInfo = ref(false);

const style = computed(() => {
  return {
    ...props.style,
    'background-color': props.player.color
  }
})

function handleClick() {
  console.log('show');
  showPlayerInfo.value = true;
}
</script>

<template>
  <span 
    :style="style"
    :class="{'my-player': props.isMyPlayer, 'player-turn': props.player.isTurn}"
    @click="handleClick"
    class="player-icon" >
    {{
      props.player.name.substring(0, 1)
    }}
  </span>
  <PlayerInfo :player="props.player" :visible="showPlayerInfo"></PlayerInfo>
</template>

<style lang="scss">
  // player-icon class circle with spacing
  .player-icon{
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 20%;
    line-height: 24px;
    font-size: 12px;
    cursor: pointer;
  }
  // glowing animated border for my player
  .my-player{
    animation: glowing 1s infinite;
  }
  @keyframes glowing{
    0%{
      border: solid 3px #dedede;
    }
    50%{
      border: solid 3px #67dbff;
    }
    100%{
      border: solid 3px #dedede;
    }
  }
  
  .player-turn{
    animation: playerTurn 1s infinite;
  }
  @keyframes playerTurn{
    0%{
      box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.85);
      transform: rotate(-10deg);
    }
    50%{
      box-shadow: 0 0px 10px 10px rgba(252, 252, 252, 0.5);
      transform: rotate(10deg);
    }
    100%{
      box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.55);
      transform: rotate(-10deg);
    }
  }
</style>