<script lang="ts" setup>
import { GAME_SETTINGS } from '../../settings';
import { useStoreV1 } from '../../store/appV1Store';

const emits = defineEmits(['next-turn', 'trap-install']);
const props = defineProps(['disabled', 'turnHideBody']);
const store = useStoreV1();

function isDisableActionsButton() {
  if (store.myPlayer?.is_assassin) {
    return store.myPoints <= GAME_SETTINGS.POINTS_EXPENSE.PLACE_TRAP
  }
  //TODO: Implement when users find the body
  return !store.gameSession.is_victim_found;
}

</script>

<template>
  <div id="control-buttons">
    <el-row justify="center">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <!-- button to the next turn -->
        <el-button :disabled="isDisableActionsButton()" type="default" id="action" @click="emits('trap-install')">
          <el-icon>
            <Position />
          </el-icon>
        </el-button>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <!-- button to the next turn -->
        <el-button type="default" id="next-turn" :disabled="props.disabled"
          :class="{ 'disabled': props.disabled, 'hidebody': props.turnHideBody }" @click="emits('next-turn')">
          <el-icon>
            <Check />
          </el-icon>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
#control-buttons {
  // fixed bottom of the screen
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: solid 1px #dedede;
  height: 80px;
  // backgroudn gradient from top to bottom with opacity 0.5 and 0.1
  background-image: linear-gradient(to bottom, rgba(126, 126, 126, 0.5) 0%, rgba(126, 126, 126, 0.1) 100%);

  .disabled {
    // button pressed
    background-color: #666666;
    background-image: linear-gradient(to bottom, rgba(78, 78, 78, 0.5) 0%, rgba(163, 163, 163, 0.1) 100%);
    box-shadow: none;
  }
}

#next-turn,
#action {
  // center horizontally
  margin: 0 auto;
  // center vertically
  margin-top: 10px;
  // round button with icon of a play
  border-radius: 50%;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 24px;
  color: #fff;
  background-color: #be6a1b;
  // 3d button style effect
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);

  &.hidebody {
    background-color: #ff0000;
  }
}
#action{
  &.is-disabled{
    background-color: rgb(90, 90, 90);
    opacity: 0.5;
  }
}
</style>