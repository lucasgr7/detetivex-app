<script lang="ts" setup>
import { TransitionPresets, useMouse, useTransition } from '@vueuse/core';
import { ElNotification } from 'element-plus';
import _ from 'lodash';
import { computed, onMounted, ref } from 'vue';
import { useStoreV1 } from '../../store/appV1Store';
import type { TypeMap, TypeCell, TypePlayerV1 } from '../../types/gamev1.js';
import PlayerIcon from './PlayerIcon.vue';

const store = useStoreV1();
const props = defineProps([
  'isAssassin',
  'turn',
  'players',
  'me',
  'hashPlayerTurn',
  'disabled']);
const emits = defineEmits(['trap-installed']);
const _notify = {
  waitYourTurn: () => {
    ElNotification({
      title: 'Espere seu turno',
      message: 'Você não pode mover quando não é seu turno',
      type: 'warning'
    });
  },
  youCannotInstallTrapHere: () => {
    ElNotification({
      title: 'Você não pode instalar uma trap aqui',
      type: 'error'
    });
  },
  alreadyHasATrap: () => {
    ElNotification({
      title: 'Já possui Armadilha',
      type: 'warning'
    });
  },
  trapPlaced: (cell: TypeCell) => {
    ElNotification({
      title: 'Armadilha instalada na posição ' + cell.x + ' - ' + cell.y,
      type: 'success'
    });
  },
  excep: (exc: any) => {
    ElNotification({
      title: exc.message,
      type: 'error'
    });
  }
}

const TURN_HIDE_BODY = 1;
const TURN_MOVE = 2;
const TURN_INSTALL_TRAP = 3;
// computed
const playersWithoutPosition = computed(() => {
  return props.players?.filter(player => !player.position || player.position === null);
})

function handleTileMapClick(x: number, y: number) {
  if (props.disabled && props.turn !== TURN_INSTALL_TRAP && props.turn !== TURN_HIDE_BODY) {
    _notify.waitYourTurn();
    return;
  }
  if (props.isAssassin) {
    if (props.turn === TURN_HIDE_BODY) {
      purgeHIddenBodyFromcells();
      const cell = getCellAt(x, y);
      cell.isHiddenBody = true
      updateCells(cell);
    }
    else if (props.turn === TURN_INSTALL_TRAP) {
      const cell = getCellAt(x, y);
      if (!hasPossibilityInstalTrap(x, y)) {
        _notify.youCannotInstallTrapHere();
        return;
      }
      if (cell.hasTrap) {
        _notify.alreadyHasATrap();
        return;
      }
      try {
        store.placeTrap(cell);
        updateCells(cell);
        _notify.trapPlaced(cell);
      }
      catch (exc: any) {
        cell.hasTrap = false;
        _notify.excep(exc);
      }
    } else {
      movePlayer(x, y);
    }
  }
  else if (props.turn === TURN_MOVE) {
    movePlayer(x, y);
  }
};


function movePlayer(x: number, y: number) {
  purgeMeFromCells();
  const cell = getCellAt(x, y);
  cell?.players?.push(props.me);
  updateCells(cell);
}

function updateCells(cell: TypeCell) {
  store.updateCells(cell);
}

function purgeMeFromCells() {
  store.purgeMyPlayerFromCells();
}
function purgeHIddenBodyFromcells() {
  for (let x = 0; x < store.gameSession.map.xAxis + 1; x++) {
    for (let y = 0; y < store.gameSession.map.yAxis + 1; y++) {
      const cell = getCellAt(x, y);
      if (cell) {
        cell.isHiddenBody = false;
      }
    }
  }
}

function isMyPlayer(hash: number): boolean {
  return props.me?.hash === hash;
}

function hasVictim(x: number, y: number) {
  const hasHiddenBody = getCellAt(x, y)?.isHiddenBody ?? false;
  return hasHiddenBody && props.turn === TURN_HIDE_BODY;
}

function hasPossibilityInstalTrap(x: number, y: number) {
  if (props.turn !== TURN_INSTALL_TRAP) return;
  const cell = getCellAt(x, y);
  if (!cell) return false;
  let possible = cell.players?.length === 0 || cell.clue != null;
  // check if this cell is next to the player
  if (possible) {
    const myPosition = store.cellAt;
    const isNextTo = (x: number, y: number) => {
      return Math.abs(x - 1) === myPosition.x && Math.abs(y - 1) === myPosition.y ||
        Math.abs(x - 1) === myPosition.x && Math.abs(y + 1) === myPosition.y ||
        Math.abs(x + 1) === myPosition.x && Math.abs(y - 1) === myPosition.y ||
        Math.abs(x + 1) === myPosition.x && Math.abs(y + 1) === myPosition.y ||
        Math.abs(x - 1) === myPosition.x && Math.abs(y) === myPosition.y ||
        Math.abs(x + 1) === myPosition.x && Math.abs(y) === myPosition.y ||
        Math.abs(x) === myPosition.x && Math.abs(y - 1) === myPosition.y ||
        Math.abs(x) === myPosition.x && Math.abs(y + 1) === myPosition.y;

    }
    possible = isNextTo(x, y);
    if (possible)
      console.table({ x, y, possible })
  }
  return possible
}
function hasTrap(x: number, y: number) {
  return (getCellAt(x, y)?.hasTrap ?? false);
}
function hasClue(x: number, y: number) {
  return (getCellAt(x, y)?.clue);
}
function getCellAt(x: number, y: number) {
  return store.getCellAt(x, y);
}
</script>

<template>
  <div id="map">
    <el-row>
      <el-col :xs="6">
        <h2>
          Jogadores
        </h2>
      </el-col>
      <el-col :xs="16">
        <span class="player-icon" v-for="(player, i) of playersWithoutPosition">
          <PlayerIcon :player="player" :hash-player-turn="props.hashPlayerTurn"
            :is-my-player="isMyPlayer(player.hash)" />
        </span>
      </el-col>
    </el-row>
    <el-row justify="center" v-for="y in store.gameSession.map.yAxis" :key="y">
      <div v-for="x in store.gameSession.map.xAxis" :key="x" class="map-tile" :class="{
        'red': hasVictim(x, y),
        'yellow': hasPossibilityInstalTrap(x, y),
        'orange': hasTrap(x, y),
        'blue': hasClue(x, y)
      }" @click="handleTileMapClick(x, y)">
        {{ x }} {{ y }}
        <span v-for="(player, i) of getCellAt(x, y).players">
          <PlayerIcon :player="player" :is-my-player="isMyPlayer(player.hash)" :hash-player-turn="props.hashPlayerTurn">
          </PlayerIcon>
        </span>
      </div>
    </el-row>
  </div>
</template>

<style lang="scss">
#map {
  padding: 10px;
  font-size: 24px;

  .map-tile {
    padding: 12px;
    width: 35px;
    height: 35px;
    margin: 4px;
    border: 1px solid rgb(37, 80, 130);

    line-height: 24px;
    font-size: 14px;
    color: rgb(176, 217, 221);
    //background smooth light blue  
    background: linear-gradient(to bottom, rgba(205, 235, 238, 0.5) 0%, rgba(29, 121, 129, 0.5) 100%);

    // border rounded with slight shadow
    box-shadow: 3px 3px 5px rgb(22, 22, 22);
    border-radius: 2px;

    //background color gradient gray


    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

  }

  // first row margin-bottom 10 px
  .el-row:first-child {
    margin-bottom: 20px;
  }



  // animate coloring red
  .red {
    animation: color-red 1s;
    background-color: red;
  }

  @keyframes color-red {
    from {
      background-color: #000000;
    }

    to {
      background-color: #ff0000;
    }
  }

  // animate coloring red
  .yellow {
    animation: color-yellow 1s;
    background-color: rgb(229, 255, 0);
  }

  @keyframes color-yellow {
    from {
      background-color: #000000;
    }

    to {
      background-color: #d2e901;
    }
  }

  // animate coloring orange
  .orange {
    animation: color-orange 1s;
    background-color: rgb(255, 102, 0);
  }

  @keyframes color-orange {
    from {
      background-color: #000000;
    }

    to {
      background-color: #e98401;
    }
  }

  .blue {
    animation: color-orange 1s;
    background-color: rgb(0, 153, 255);
  }

}
</style>