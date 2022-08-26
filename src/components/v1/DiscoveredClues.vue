<script lang="ts" setup>
import { useStoreV1 } from '../../store/appV1Store';


const store = useStoreV1();

</script>

<template>
  <el-container id="clues">

    <el-header>
      <h2>Pistas encontradas</h2>
    </el-header>
    <div class="clue-content">
      <span v-for="(clue, i) of store.gameSession.revealed_clues" :key="i">
        {{ i + 1 }}. {{ clue }}
        <br />
      </span>
    </div>
  </el-container>
</template>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto);
@import url(https://fonts.googleapis.com/css?family=Handlee);

#clues {
  margin: 40px 0 0;
  position: relative;
  width: 90%;
  max-width: 800px;
  min-width: 400px;
  height: 180px;
  margin: 0 auto;
  background: #fafafa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
  font-family: monospace;
  font-size: 14px;
  padding: 12px;
  color: rgb(255, 72, 72);
  margin-bottom: 80px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 60px;
    background: radial-gradient(#575450 6px, transparent 7px) repeat-y;
    background-size: 30px 30px;
    border-right: 3px solid #D44147;
    box-sizing: border-box;
  }

  .clue-content {
    margin-top: 20px;
    position: absolute;
    top: 30px;
    right: 0;
    bottom: 30px;
    left: 60px;
    background: linear-gradient(transparent, transparent 28px, #91D1D3 28px);
    background-size: 30px 30px;

    span {
      width: 100%;
      max-width: 100%;
      height: 100%;
      max-height: 100%;
      line-height: 30px;
      padding: 0 10px;
      border: 0;
      outline: 0;
      background: transparent;
      color: mediumblue;
      font-family: 'Handlee', cursive;
      font-weight: bold;
      font-size: 18px;
      box-sizing: border-box;
      z-index: 1;
    }
  }
}
</style>