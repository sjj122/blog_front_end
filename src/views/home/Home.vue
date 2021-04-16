<template>
  <div class="home">
    <!--分三部分-->
    <div :class="$route.path === '/myPhoto' ? 'main linear_background' : 'main'">
      <div class="left">
        <!-- <home-left-com></home-left-com> -->
        <home-left-arrow v-if="$route.path === '/myPhoto' && getPhotoArrow"></home-left-arrow>
      </div>
      <div class="middle"><router-view></router-view></div>
      <div class="right">
        <home-guide-arrow v-if="!!getUserId"></home-guide-arrow>
        <home-right-com v-if="$route.path === '/lam'"></home-right-com>
      </div>
    </div>
  </div>
</template>

<script>
  import HomeLeftCom from './childComps/HomeLeftCom'
  import HomeRightCom from './childComps/HomeRightCom'
  import HomeGuideArrow from './childComps/HomeGuideArrow'
  import HomeLeftArrow from './childComps/HomeLeftArrow'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Home',
    components: {
      HomeLeftCom,
      HomeRightCom,
      HomeGuideArrow,
      HomeLeftArrow
    },
    computed:{
      ...mapGetters(['getUserId', 'getPhotoArrow'])
    }
  }
</script>

<style scoped>
  .home {
    margin-top: 65px;
  }

  .main {
    display: flex;
  }
  .linear_background {
    background-image: linear-gradient(to right bottom, #a8edea 0%, #fed6e3 100%);
  }

  .left {
    width: 16%;
  }
  .middle {
    width: 66%;
    border-bottom:1px solid #eee;
  }
  .right {
    width: 18%;
    display: flex;
  }
</style>

