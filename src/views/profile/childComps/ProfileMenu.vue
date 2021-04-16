<template>
  <el-menu
    :default-active="getShowWho"
    background-color="#add8e6"
    text-color="black"
    active-text-color="#fff" @select="select">
    <el-menu-item index="1">
      <i class="iconfont icon-gerenziliao"></i>
      <span>个人资料</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="iconfont icon-boke3"></i>
      <span slot="title">我的博客</span>
    </el-menu-item>
    <el-menu-item index="3" v-if="$route.meta.path !== '/profileVisit'">
      <i class="iconfont icon-follow"></i>
      <span slot="title">我的关注</span>
    </el-menu-item>
    <el-menu-item index="4" v-if="$route.meta.path !== '/profileVisit'">
      <i class="iconfont icon-zhaopian"></i>
      <span slot="title">我的照片</span>
    </el-menu-item>
    <el-menu-item index="5" v-if="$route.meta.path !== '/profileVisit' && getNickName.trim() === 'sjj'">
      <i class="iconfont icon-dongtai"></i>
      <span slot="title">发布动态</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'ProfileMenu',
    methods: {
      select (index) {
        this.$emit('select', index)
      }
    },
    computed: {
      ...mapGetters(['getNickName', 'getShowWho'])
    }
  }
</script>
<style scoped>
  .el-menu {
    width: 14%;
    margin-left: 6px;
    height: 610px;
  }
  i {
    font-size: 22px;
    margin-right: 16px;
  }
  span {
    font-size: 16px;
  }
</style>
