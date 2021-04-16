<template>
  <div class="blog-item">
    <div class="top">
      <div class="title" @click="goToDetail">{{content.b_title}}</div>
      <el-tag @click="goToContinueEdit" v-if="$route.meta.path !== '/profileVisit'">继续编辑</el-tag>
    </div>
    <div class="bottom">
      <div class="desc" @click="goToDetail">{{desc}}</div>
      <div class="right">
        <el-tag type="warning" size="mini">博文</el-tag>
      </div>
    </div>
  </div>
</template>
<script>
  import {request} from '../../../network/request'
  export default {
    name: 'ProfileBlogItem',
    data () {
      return {
        content: {},
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
    computed: {
      // 截取文章中的内容作为描述信息
      desc () {
        return this.content.b_content_html !== undefined ?
          this.content.b_content_html.replace(/(<.*?>)/g, '') : ''
      }
    },
    methods: {
      async getContentById () {
        try {
          const {data: res} = await request({
            url: '/getContentById',
            method: 'post',
            data: { b_id: this.b_id }
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          else this.content = res.result.content
        } catch (err) {
          console.log(err)
        }
      },
      // 去到详情页
      goToDetail () {
        this.$router.push(`/blogDetail/${this.b_id}`)
      },
      // 继续编辑
      goToContinueEdit () {
        this.$router.push(`/editBlog/${this.b_id}`)
      }
    },
    created () {
      this.getContentById()
    }
  }
</script>
<style scoped>
  .blog-item {
    margin-top: 1%;
    margin-bottom: 1%;
  }
  .top {
    display: flex;
    margin-bottom: 6px;
    margin-left: 4px;
    justify-content: space-between;
  }
  .title {
    font-size: 16px;
    color: #3D3D3D;
    font-weight: 600;
    cursor: pointer;

    overflow: hidden;/*内容超出后隐藏*/
    text-overflow: ellipsis;/* 超出内容显示为省略号*/
    white-space: nowrap;/*文本不进行换行*/
  }
  .bottom {
    display: flex;
    margin-bottom: 1%;
  }
  .desc {
    width: 90%;
    margin-top: 6px;
    margin-left: 6px;
    font-size: 14px;
    color: #6B6B6B;

    overflow: hidden;/*内容超出后隐藏*/
    text-overflow: ellipsis;/* 超出内容显示为省略号*/
    white-space: nowrap;/*文本不进行换行*/

    cursor: pointer;
  }
  .right {
    font-size: 14px;
    display: flex;
  }
  .el-tag {
    margin-top: 4px;
    margin-left: 36px;
  }
  .top .el-tag {
    margin-top: 0;
    cursor: pointer;
  }
</style>
