<template>
  <el-drawer
    :withHeader="false"
    :visible.sync="drawer"
    direction="ltr"
    :before-close="beforeClose"
    size="45%" @open="openDrawer">

    <!--大头标题-->
    <div class="author">
      <img :src="userInfo.avatar">
      <p>{{userInfo.nickname}}</p>
    </div>

    <!--渲染文章简介列表-->
    <user-blog-drawer-card v-for="(item, index) in showBlogContents" :key="index" :item="item"
    ></user-blog-drawer-card>

    <!--分页条-->
    <el-pagination layout="prev, pager, next"
                   :total="userBlogContents.length" :page-size="3"
    @current-change="currentChange"></el-pagination>

  </el-drawer>
</template>
<script>
  import {request} from '../../../network/request'

  import UserBlogDrawerCard from './UserBlogDrawerCard'

  export default {
    name: 'UserBlogDrawer',
    data () {
      return {
        userInfo: {},

        userBlogContents: [],   // 用户个人所有的博客数据

        showBlogContents: [],  // 当前页所展示的博客数据
      }
    },
    props: {
      drawer: {
        type: Boolean,
        default() {
          return false
        }
      },
      user_id: {
        type: String,
        default () {
          return ''
        }
      },
      contentCount: {
        type: Number,
        default () {
          return 0
        }
      }
    },
    methods: {
      // 关闭抽屉将事件发出
      beforeClose () {
        this.$emit('beforeClose')
      },
      // 获取点击的用户信息
      async getClickUserInfo () {
        const {data: res} = await request({
          url: '/getUserById',
          method: 'post',
          data: { user_id: this.user_id }
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        this.userInfo = res.result
      },
      // 打开抽屉获取根据文章id文章信息
      async openDrawer () {
        if (this.userBlogContents.length !== this.contentCount) { // 阻止反复发送请求
          const {data: res} = await request({
            url: '/getContentsByArray',
            method: 'post',
            data: { blogIdArr: this.userInfo.contents }
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          // 返回的是一个数组，数组里面嵌套this.userInfo.contents.length 个数组，每个小数组里面存放博客对象
          for (let blog of res.result) {
            this.userBlogContents.push(blog[0])
          }
          // 第一次打开抽屉的时候取前四条，后面再次打开就可以保存用户上一次的记录了
          this.showBlogContents = this.userBlogContents.slice(0, 4) // 取前四条
        }
      },
      // 页码发生编发
      currentChange (page) {
        this.showBlogContents =
          this.userBlogContents.slice(4 * (page - 1), 4 * (page - 1) + 4)
      }
    },
    created () {
      // 根据id获取用户信息
      this.getClickUserInfo()
    },
    components: {
      UserBlogDrawerCard
    }
  }
</script>
<style scoped>
  .author {
    height: 88px;
    font-size: 22px;
    letter-spacing: 4px;
    text-align: center;
    margin-top: 4px;
  }
  .author img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .author p {
    margin: 0;
    padding: 0;
  }
  .el-pagination {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 20px;
  }
</style>
