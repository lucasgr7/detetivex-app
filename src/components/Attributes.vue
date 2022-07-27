<script lang="ts" setup>
import { useStore } from '../store/appStore';

const store = useStore();
</script>
<template>
<el-card class="card-margin">
  <el-row>
    <el-tag type="success" effect="plain">Atributos</el-tag>
  </el-row>
  <p v-for="(item, i) of store.myAttributes" :key="i">
    {{item.name}}
  </p>
</el-card>

</template>