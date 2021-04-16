<template>
  <div id="app">
    <!--顶部内容，写博客的时候不显示navbar-->
    <NavBar
      v-if="!/\/editBlog\/.*/.test($route.path) && !/\/blogDetail\/.*/.test($route.path)">
    </NavBar>
    <router-view v-if="isRouterAlive"/>
    <!--footer-->
    <Footer></Footer>
  </div>
</template>

<script>
  import NavBar from './common/components/NavBar'
  import Footer from './common/components/Footer'
  export default {
    components: {
      NavBar,
      Footer
    },
    provide () {
      return {
        reload: this.reload
      }
    },
    data () {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      }
    },
    created () {
      // console.log(`
      //    * * * * * *      * * * * * *
      //           *                *
      //           *                *
      //           *                *
      //           *                *
      //           *                *
      //     *     *          *     *
      //       *   *            *   *
      //        * *              * *
      // `)
    }
  }

</script>

<style>
  @import "//at.alicdn.com/t/font_2101519_iwjy80ayu3h.css";  /* 最近的iconfont项目库 */

  @import "//at.alicdn.com/t/font_1332895_cjn0536dob.css";
  @import "//at.alicdn.com/t/font_2461617_kx11xmmetpm.css"; /* 长箭头 */

  body, html {
    padding: 0;
    margin: 0;
  }
</style>
