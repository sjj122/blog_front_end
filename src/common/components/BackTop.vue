<template>
  <div>
    <!--回到顶部-->
    <el-backtop>
      <div><i class="iconfont icon-backtop top"></i></div>
    </el-backtop>
    <div v-if="isShow" class="backtop fade">回到顶部</div>
  </div>
</template>
<script>
  export default {
    name: 'BackTop',
    data () {
      return {
        isShow: false
      }
    },
    mounted () {
      window.addEventListener('scroll', this.scroll)
    },
    methods: {
      scroll () {
        this.isShow = window.pageYOffset >= 200
      }
    }
  }
</script>
<style scoped>
  .top {
    font-size: 40px;
  }
  .backtop {
    position: fixed;
    bottom: 20px;
    right: 32px;
    font-size: 14px;
  }
  .fade {
    animation-name: fade;
    animation-duration: 1.6s;
    animation-timing-function: ease;
  }
  @keyframes fade {
    0% {opacity: 0;}
    100% {opacity: 1;}
  }
</style>
