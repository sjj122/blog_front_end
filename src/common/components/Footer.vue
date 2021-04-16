<template>
  <div :class="$route.path === '/myPhoto' ? 'footer linear_background' : 'footer'">
    如 对 作 者 感 兴 趣 ， 欢 迎 留 言 给 作 者
  </div>
</template>
<script>
  export default {
    name: 'Footer'
  }
</script>
<style scoped>
  .footer {
    width: 100%;
    height: 16px;
    text-align: center;
    margin-top: 6px;
    font-size: 14px;
  }
  .linear_background {
    background-image: linear-gradient(to right top, #a8edea 0%, #fed6e3 100%);
    color: white;
    margin-top: 0;
    height: 28px;
  }
</style>
