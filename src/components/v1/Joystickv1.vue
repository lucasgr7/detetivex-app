<script lang="ts" setup>
</script>

<template>
<div id="control-buttons">
  <el-row justify="center">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <!-- button to the next turn -->
      <el-button type="primary" id="next-turn" @click="emits('next-turn')">
        <el-icon><Check /></el-icon>
      </el-button>
    </el-col>
  </el-row>
</div>
</template>

<style lang="scss">
#control-buttons{
  // fixed bottom of the screen
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: solid 1px #dedede;
  height: 80px;
  // backgroudn gradient from top to bottom with opacity 0.5 and 0.1
  background-image: linear-gradient(to bottom, rgba(126, 126, 126, 0.5) 0%, rgba(126, 126, 126, 0.1) 100%);
}
#next-turn{
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
  background-color: #00bcd4;
  
}
</style>