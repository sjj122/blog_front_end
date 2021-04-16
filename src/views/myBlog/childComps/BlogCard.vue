<template>
  <div>
    <!--小红点-->
    <el-badge isDot v-if="isTwinkle" :class="{'badge-animation': isTwinkle}"></el-badge>
    <!--置顶标识-->
    <i v-if="item.isTop" class="iconfont icon-top setTop"></i>
    <!--卡片内容-->
    <el-card shadow="hover">
      <div class="title" @click="goToDetail">
        <span v-if="item.isJian" class="jian">荐</span>
        {{item.b_title}}
      </div>
      <div class="desc">{{desc}}</div>
      <div class="info">
        <div class="user">
          <img class="avatar" :src="userInfo.avatar">
          <div class="nickname">{{userInfo.nickname}}</div>
        </div>
        <div class="caozuo">
          <i :class="{'iconfont': true, 'icon-zan': true, 'active': isZan}" @click="clickZan"></i>
          <span class="zanCount">{{item.b_stars.length}}</span>

          |<i class="iconfont icon-look caozuo2"></i>
          <span class="zanCount">{{item.b_looks.length}}</span>

          |<i class="el-icon-chat-dot-square caozuo2"></i>
          <span class="zanCount">{{item.b_comments.length}}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {request} from '../../../network/request'
  export default {
    name: 'BlogCard',
    props: {
      item: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        isTwinkle: false,

        userInfo: {},

        isZan: false,   // 是否点过赞
      }
    },
    computed: {
      ...mapGetters(['getUserId']),
      // 截取文章中的内容作为描述信息
      desc () {
        return this.item.b_content_html.replace(/(<.*?>)/g, '')
      }
    },
    methods: {
      // 红点闪烁
      badgeTwinkle () {
        if (timer) clearTimeout(timer)
        this.isTwinkle = true
        let timer = setTimeout(() => {
          this.isTwinkle = false
        }, 4000)
      },
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
      // 去到详情页（增加访问量）
      async goToDetail () {
        if (this.getUserId !== '') {
          const {data: res} = await request({
            url: '/lookContent',
            method: 'post',
            data: {
              user_id: this.getUserId,
              b_id: this.item.b_id
            }
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          this.item.b_looks = this.result
        }
        this.$router.push(`/blogDetail/${this.item.b_id}`)
      },
      // 判断文章是否被当前用户点过赞
      checkZan () {
        if (this.getUserId !== '') {
          for (let i of this.item.b_stars) {
            if (i === window.localStorage.getItem('user_id')) {
              this.isZan = true
              break
            }
          }
        }
      },
      // 为文章点赞
      async clickZan () {
        if (this.getUserId === '') {
          this.$message.warning('劳烦壮士登录先')
        } else {
          const {data: res} = await request({
            url: '/zanContent',
            method: 'post',
            data: {
              user_id: this.getUserId,
              b_id: this.item.b_id
            }
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          this.item.b_stars = res.result
          this.isZan = !this.isZan
        }
      }
    },
    created () {
      // 红点闪烁
      this.badgeTwinkle()
      // 检查点赞
      this.checkZan()
      // 获取发表文章的用户信息
      this.getUserInfoById()
    }
  }
</script>
<style scoped>
  .el-badge {
    position: absolute;
  }
  /*红点闪烁动画*/
  .badge-animation {
    animation-name: fade;
    animation-duration: 4s;
    animation-timing-function: ease;
  }
  @keyframes fade {
    0% {opacity: 1;}
    50% {opacity: 1;}
    100% {opacity: 0;}
  }

  .setTop {
    font-size: 50px;
    position: absolute;
    color: blue;
  }
  .el-card {
    width: 100%;
    min-width: 800px;
  }
  .el-card:hover {
    background-color: #F5F5F5;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    height: 28px;
    line-height: 28px;

    overflow: hidden;/*内容超出后隐藏*/
    text-overflow: ellipsis;/* 超出内容显示为省略号*/
    white-space: nowrap;/*文本不进行换行*/
  }
  .jian {
    border: 2px solid red;
    border-radius: 16%;
    color: red;
  }
  .desc {
    margin-top: 10px;
    font-size: 14px;
    color: #8a8a8a;

    overflow: hidden;/*内容超出后隐藏*/
    text-overflow: ellipsis;/* 超出内容显示为省略号*/
    white-space: nowrap;/*文本不进行换行*/
  }
  .info {
    margin-top: 10px;
    display: flex;
    font-size: 14px;
    justify-content: space-between;
  }
  .user {
    display: flex;
    text-align: center;
  }
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  .nickname {
    margin-top: 2px;
    margin-left: 9px;
  }
  .caozuo span {
    color: blue;
    margin-left: 4px;
    cursor: pointer;
  }
  .caozuo i {
    cursor: pointer;
  }
  .caozuo2 {
    padding-left: 10px;
  }
  .active {
    color: red;
  }
</style>
