<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script lang="ts" setup>
import {useRoute} from "vue-router";

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
