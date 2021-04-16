<template>
  <div class="recommend-item">
    <div class="top">
      <div class="title" @click="goToDetail">{{item.b_title}}</div>
      <div class="look" :title="item.b_title" @mouseenter="$mouseenter" @mouseleave="$mouseleave">{{showDate_or_look}}</div>
    </div>
    <div class="bottom">
      <div class="desc" @click="goToDetail">{{desc}}</div>
      <div class="right">
        <el-tag type="warning" size="mini">博文</el-tag>
        <div class="author">来自：<span>{{userInfo.nickname}}</span></div>
      </div>
    </div>
  </div>
</template>
<script>
  import {dateFormat} from '../../../common/utils/dateFormat'
  import {request} from '../../../network/request'
  export default {
    name: 'BlogDetailRecommendItem',
    data () {
      return {
        userInfo: {},

        // 鼠标移进显示日期
        showDate_or_look: `阅读量：${this.item.b_looks.length}`
      }
    },
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
      // 根据user_id获取用户数据
      async getUserInfoById () {
        const {data: res} = await request({
          url: '/getUserById',
          method: 'post',
          data: { user_id: this.item.b_user_id}
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        this.userInfo = res.result
      },
      // 鼠标进入更改阅读量为发布日期
      $mouseenter () {
        this.showDate_or_look = dateFormat(new Date(this.item.b_created_time), 'MM-dd')
      },
      // 移出
      $mouseleave () {
        this.showDate_or_look = `阅读量：${this.item.b_looks.length}`
      },
      // 去到详情页
      goToDetail () {
        this.$router.push(`/blogDetail/${this.item.b_id}`)
      }
    },
    created () {
      this.getUserInfoById()
    }
  }
</script>
<style scoped>
  .recommend-item {
    border-bottom: 1px solid #3D3D3D;
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
  }
  .look {
    font-size: 13px;
    color: #999999;
    padding-top: 2.8px;
    cursor: pointer;
  }
  .bottom {
    display: flex;
    margin-bottom: 1%;
  }
  .desc {
    width: 80%;
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
    margin-left: 8px;
  }
  .author {
    margin-top: 4px;
    margin-left: 10px;
    min-width: 100px;
    height: 20px;
  }
  .author span {
    color: #3399EA;
    cursor: pointer;
    font-size: 12px;
  }
</style>
