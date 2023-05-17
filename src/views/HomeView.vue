<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
      <webview class="webview" httpreferrer src="https://file.twhzx.com/etc/licenses/twh_policy_2022_1202.html"></webview>
    <TheWelcome />
  </main>
</template>
<style scoped>
.webview{
  width: 2560px;
    height: 1000px;
}
</style>