<template>
  <div class="about">
      <div id="canvas"></div>
  </div>
</template>
<script lang="ts" setup>
import {useRoute} from "vue-router";
// import NERtcEngine from "nertc-electron-sdk"
const NERtcEngine = require("nertc-electron-sdk").default;
console.log(NERtcEngine);
const route = useRoute();
console.log(route.query);

</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
