<script setup lang="ts">
import { _campaing_1 } from "./mocks/campaing"
import _ from 'lodash';

</script>

<template>
<el-main>
  <RouterView></RouterView>
</el-main>
</template>

<style scoped>
span{
  font-size: 18px;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
