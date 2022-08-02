<script lang="ts" setup>

const emits = defineEmits(['click']);
const props = defineProps(['type']);
</script>

<template>
  <button @click="emits('click')" class="button-3d" :class="props.type">
    <slot>

    </slot>
  </button>
</template>
<style lang="scss" scoped>
.button-3d {
  font-family: Saira;
  position: relative;
  width: auto;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
  font-size: 12px;

  -webkit-transition: all 0.1s;
  -moz-transition: all 0.1s;
  transition: all 0.1s;

  color: #ecf0f1;
  border: solid 1px #5c5c5c;
  background: #6b6b6b;
  -webkit-box-shadow: 0px 6px 0px #525252;
  -moz-box-shadow: 0px 6px 0px #666666;
  box-shadow: 0px 6px 0px #575757;


  &:focus {
    outline: 2px;
    border-color: #4b4b4b;
  }

  &:hover {
    border-color: #4d4d4d;
  }

  &:active {
    -webkit-box-shadow: 0px 2px 0px #0004d3;
    -moz-box-shadow: 0px 2px 0px #2700d3;
    box-shadow: 0px 2px 0px #3d3d3d;
    position: relative;
    top: 4px;
    border-color: 0px 2px 0px #2000d3;
  }
  &.success {
    color: #000000;
    border: solid 1px #12f325;
    background: #32e622;
    -webkit-box-shadow: 0px 6px 0px #00d335;
    -moz-box-shadow: 0px 6px 0px #07d300;
    box-shadow: 0px 6px 0px #009708;

    &:focus {
      outline: 2px;
      border-color: #07e000;
    }

    &:hover {
      border-color: #07e000;
    }

    &:active {
      -webkit-box-shadow: 0px 2px 0px #00d30b;
      -moz-box-shadow: 0px 2px 0px #00d300;
      box-shadow: 0px 2px 0px #00d300;
      position: relative;
      top: 4px;
      border-color: 0px 2px 0px #00d312;
    }
  }
  &.info {
    color: #000000;
    border: solid 1px #12e4f3;
    background: #22e6e6;
    -webkit-box-shadow: 0px 6px 0px #00c5d3;
    -moz-box-shadow: 0px 6px 0px #00d3d3;
    box-shadow: 0px 6px 0px #009797;

    &:focus {
      outline: 2px;
      border-color: #00c6e0;
    }

    &:hover {
      border-color: #00d1e0;
    }

    &:active {
      -webkit-box-shadow: 0px 2px 0px #0097d3;
      -moz-box-shadow: 0px 2px 0px #00a2d3;
      box-shadow: 0px 2px 0px #00b3d3;
      position: relative;
      top: 4px;
      border-color: 0px 2px 0px #00d3d3;
    }
  }
  &.danger {
    color: #ecf0f1;
    border: solid 1px #f31212;
    background: #e62222;
    -webkit-box-shadow: 0px 6px 0px #d30000;
    -moz-box-shadow: 0px 6px 0px #d30000;
    box-shadow: 0px 6px 0px #970000;

    &:focus {
      outline: 2px;
      border-color: #e03400;
    }

    &:hover {
      border-color: #e00000;
    }

    &:active {
      -webkit-box-shadow: 0px 2px 0px #d30000;
      -moz-box-shadow: 0px 2px 0px #d30000;
      box-shadow: 0px 2px 0px #d30000;
      position: relative;
      top: 4px;
      border-color: 0px 2px 0px #d30000;
    }
  }
  &.warning {
    color: #ecf0f1;
    border: solid 1px #f39c12;
    background: #e67e22;
    -webkit-box-shadow: 0px 6px 0px #d35400;
    -moz-box-shadow: 0px 6px 0px #d35400;
    box-shadow: 0px 6px 0px #d35400;

    &:focus {
      outline: 2px;
      border-color: #e03400;
    }

    &:hover {
      border-color: #e03400;
    }

    &:active {
      -webkit-box-shadow: 0px 2px 0px #d35400;
      -moz-box-shadow: 0px 2px 0px #d35400;
      box-shadow: 0px 2px 0px #d35400;
      position: relative;
      top: 4px;
      border-color: 0px 2px 0px #d35400;
    }
  }
}
</style>