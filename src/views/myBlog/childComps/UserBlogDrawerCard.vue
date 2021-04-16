<template>
  <el-card>
    <div class="title textEllipsis" @click="goToDetail">{{item.b_title}}</div>
    <div class="bio textEllipsis">{{desc}}</div>
    <div class="clickLook" @click="goToDetail">点击查看</div>
  </el-card>
</template>
<script>
  export default {
    name: 'UserBlogDrawerCard',
    props: {
      item: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      // 截取文章中的内容作为描述信息
      desc () {
        return this.item.b_content_html.replace(/(<.*?>)/g, '')
      }
    },
    methods: {
      // 去到详情页
      goToDetail () {
        this.$router.push(`/blogDetail/${this.item.b_id}`)
      }
    }
  }
</script>
<style scoped>
  .el-card {
    margin: 1% auto 0;
    width: 96%;
  }
  .textEllipsis {
    margin-bottom: 6px;
    /*一行显示，超出省略号*/
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .title {
    font-size: 19px;
    font-weight: 700;
    cursor: pointer;
  }
  .bio {
    font-size: 14px;
    color: #999999;
  }
  .clickLook {
    display: flex;
    justify-content: flex-end;
    margin-top: .6%;
    font-size: 15px;
    color: orange;
    cursor: pointer;
  }
</style>
