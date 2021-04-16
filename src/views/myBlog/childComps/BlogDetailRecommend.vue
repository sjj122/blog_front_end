<template>
  <el-card>
    <div class="recommend" v-for="(item, index) in recommend" :key="item.b_id">
      <blog-detail-recommend-item :item="item"></blog-detail-recommend-item>
    </div>
    <div class="tip">没有更多推荐了，<span @click="backHome">返回首页</span></div>
  </el-card>
</template>
<script>
  import {request} from '../../../network/request'
  import BlogDetailRecommendItem from './BlogDetailRecommendItem'
  export default {
    name: 'BlogDetailRecommend',
    data () {
      return {
        recommend: []
      }
    },
    props: {
      b_id: {
        type: String,
        default () {
          return ''
        }
      }
    },
    components: {
      BlogDetailRecommendItem
    },
    methods: {
      // 获取推荐数据
      async getRecommend () {
        const {data: res} = await request({
          url: '/getRecommend',
          method: 'post',
          data: { b_id: this.b_id }
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        this.recommend = res.result
      },
      // 返回首页
      backHome () {
        this.$router.replace('/myBlog')
      }
    },
    created () {
      this.getRecommend()
    }
  }
</script>
<style scoped>
  .el-card {
    width: 80%;
    text-align: left;
    margin: .4% 18%;
  }
  .tip {
    padding: 6px;
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
  .tip span {
    color: #79A5E5;
    cursor: pointer;
  }
</style>
