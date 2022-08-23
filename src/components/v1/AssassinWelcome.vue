<script lang="ts" setup>
import Modal from '../common/Modal.vue';
import assassinInformative from '../../assets/images/assassin-instruction.png';
import profileAssassin from '../../assets/images/profile-assassin.png';
const props = defineProps(['visible']);
const emits = defineEmits(['close']);


</script>

<template>
  <Modal :visible="props.visible" :forced="false" :fullscreen="true" title="ASSASSINO">
    <el-main id="create-player-modal-body">
      <el-row justify="center">
        <img id="picture-assassin" :src="profileAssassin" alt="assassin-instruction" />
      </el-row>
      <el-row>
        <h2>
          Você acabou de cometer um assassinato
          <br />
          precisa esconder o corpo no mapa.
          Escolha um dos quadrados no mapa e finalize o turno.
        </h2>
      </el-row>
      
        <hr/>
      <el-row justify="center">
        <img :src="assassinInformative" alt="assassin-instruction" />
      </el-row>
      <el-row justify="end">
        <el-button type="success" @click="emits('close')">
          ok
        </el-button>
      </el-row>
    </el-main>
  </Modal>
</template>

<style lang="scss" scoped>
h2 {
  font-size: 30px;
  line-height: 30px;
}
#picture-assassin{

}
</style>