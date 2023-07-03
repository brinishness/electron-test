<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import {onMounted} from "vue";
// document.querySelector(".webview").onmessage = (data) => {
//   console.log(data);
// };

onMounted(() => {
  window.addEventListener("message", (data) => {
    console.log(data);
  }, false);

  var webview = document.querySelector('webview');
  webview.addEventListener("did-finish-load", () => {
    console.log(webview.isLoading());
    // prompt('hello')
    let aaa = webview.executeJavaScript(`aaa(111)`); // 执行webview中的aaa方法
    aaa.then(res => {
      console.log(res);
    });
  })

  setTimeout(() => {
    let aaa = webview.executeJavaScript(`window`); // 执行webview中的aaa方法
    aaa.then(res => {
      console.log(res);
    });
    // console.log(aaa);
  })
  setTimeout(() => {
    let aaa = webview.executeJavaScript(`console.log('131231')`); // 执行webview中的aaa方法
    aaa.then(res => {
      console.log(res);
    });
    // console.log(aaa);
  }, 3000)
  // iframe.onload = function () {
  //   // 向domain2发送跨域数据
  //   iframe.exec.postMessage('来自domain1的消息', '*');
  // };
})
// window.postMessage("hello", "*");
</script>

<template>
  <main>

    <webview class="webview" httpreferrer="https://www.baidu.com" allowRendererProcessReuse="false" src="https://www.baidu.com" disablewebsecurity></webview>
    <TheWelcome/>
  </main>
</template>
<style scoped>
.webview {
  width: 2560px;
  height: 1000px;
  border: none;
}
</style>