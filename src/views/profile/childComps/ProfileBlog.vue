<template>
  <profile-card>
    <div slot="tip">我的博客</div>
    <div class="main" slot="main">
      <i class="iconfont icon-wanquJT wanqu"></i>
      <el-card v-for="item in page === 1 ? userInfo.contents.slice(0, 3) : showMyContents" :key="item">
        <profile-blog-item :b_id="item"></profile-blog-item>
      </el-card>

      <!--分页条-->
      <el-pagination layout="prev, pager, next" @current-change="currentChange" hide-on-single-page
          :pageSize="3" :total="userInfo.contents !== undefined ? userInfo.contents.length : 0"></el-pagination>
    </div>
  </profile-card>
</template>
<script>
  import ProfileCard from './ProfileCard'
  import ProfileBlogItem from './ProfileBlogItem'
  export default {
    name: 'ProfileBlog',
    components: {
      ProfileCard,
      ProfileBlogItem
    },
    data () {
      return {
        showMyContents: [],

        page: 1,  // 当前页码
      }
    },
    props: {
      userInfo: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    methods: {
      // 页码的改变
      currentChange (page) {
        this.page = page
        this.showMyContents =
          this.userInfo.contents.slice(3 * (page - 1), 3 * (page - 1) + 3)
      }
    }
  }
</script>
<style scoped>
  .wanqu {
    position: fixed;
    font-size: 100px;
    top: 60px;
    margin-left: 62%;
    color: orange;
  }
  .el-card {
    margin-top: 4px;
  }
  .main {
    position: relative;
    height: 460px;
  }
  .el-pagination {
    background-color: transparent !important;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
  }
</style>
