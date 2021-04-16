<template>
  <div>
    <!--当前登录的用户头像，没登录就不显示-->
    <img v-if="getAvatarUrl" class="userAvatar" :src="getAvatarUrl">

    <!--发布文章的用户信息区-->
    <blog-detail-user-info :userInfo="userInfo" @openUserBlogDrawer="openDrawer"></blog-detail-user-info>
    <user-blog-drawer :drawer="drawer"
                      :user_id="userInfo.user_id"
                      :contentCount="userInfo.contents.length"
                      @beforeClose="beforeDrawerClose">
    </user-blog-drawer>

    <!--文章区域-->
    <el-card class="content">
      <div class="title">{{contentInfo.b_title}}</div>
      <div class="contentInfo">
        <el-tag size="mini" type="danger">原创</el-tag>
        <div class="text">{{userInfo.nickname}}</div>
        <div class="text">最后发布于 {{contentInfo.b_created_time | showDate}}</div>
        <div class="text">阅读数 {{contentInfo.b_looks.length}}</div>
      </div>

      <article v-html="contentInfo.b_content_html"></article>

      <div class="caozuo">
        <div class="button" @click="zanContent">
          <i :class="{'iconfont': true, 'icon-zan': true, 'active': isZanFlag}"></i>  点赞  {{contentInfo.b_stars.length}}
        </div>
      </div>
    </el-card>

    <!--评论区域-->
    <blog-detail-comments :comments="contentInfo.b_comments" :b_id="b_id">
    </blog-detail-comments>

    <!--推荐区域-->
    <blog-detail-recommend :b_id="b_id"></blog-detail-recommend>
  </div>
</template>
<script>
  import BlogDetailUserInfo from './BlogDetailUserInfo'
  import BlogDetailComments from './BlogDetailComments'
  import BlogDetailRecommend from './BlogDetailRecommend'
  import UserBlogDrawer from './UserBlogDrawer'

  import {request} from '../../../network/request'
  import {dateFormat} from '../../../common/utils/dateFormat'
  import {getSessionStorage} from '../../../common/utils/getSessionStorage'

  import {mapGetters} from 'vuex'
  export default {
    name: 'BlogDetail',
    inject: ['reload'],
    data () {
      return {
        b_id: this.$route.params.b_id,

        contentInfo: {},
        userInfo: {},

        isZanFlag: false, // 当前用户是否对当前文章点过赞

        drawer: false,    // 用户博客抽屉是否需要打开，默认不打开
      }
    },
    methods: {
      // 根据文章id找文章，顺带根据id找用户
      async getContentById () {
        const {data: res} = await request({
          url: '/getContentById',
          method: 'post',
          data: { b_id: this.b_id }
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        this.contentInfo = res.result.content
        this.userInfo = res.result.userInfo
        this.checkZan()
      },
      // 赞文章
      async zanContent () {
        if (this.getUserId === '') {
          this.$message.warning('劳烦壮士登录先')
        } else {
          const {data: res} = await request({
            url: '/zanContent',
            method: 'post',
            data: {
              b_id: this.b_id,
              user_id: this.getUserId
            }
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          this.contentInfo.b_stars = res.result
          this.isZanFlag = !this.isZanFlag
        }
      },
      // 判断文章是否被当前用户点过赞
      checkZan () {
        if (this.getUserId !== '' && this.contentInfo.b_stars !== undefined) {
          for (let i of this.contentInfo.b_stars) {
            if (i === window.localStorage.getItem('user_id')) {
              this.isZanFlag = true
              break
            }
          }
        }
      },
      // 获取sessionStorage里面的内容
      getUserInfoFormSession () {
        if (getSessionStorage()) {
          this.$store.commit('setUserInfo', getSessionStorage())
        }
      },
      // 接收打开用户文章抽屉事件
      openDrawer () {
        this.drawer = true
      },
      // 接收关闭用户文章抽屉事件
      beforeDrawerClose () {
        this.drawer = false
      }
    },
    computed: {
      ...mapGetters(['getAvatarUrl', 'getUserId'])
    },
    components: {
      BlogDetailUserInfo,
      BlogDetailComments,
      BlogDetailRecommend,
      UserBlogDrawer
    },
    watch: {
      '$route': function (to, from) { // 这里不能使用箭头函数否则会找不到 this
        if (from.path !== to.path) {
          this.getContentById()       // 监测到路径的改变重新获取文章资源
          this.reload()
        }
      }
    },
    created () {
      this.getUserInfoFormSession()
      this.getContentById()
    },
    filters: {
      showDate (value) {
        return dateFormat(new Date(value), 'yyyy-MM-dd hh:mm:ss')
      }
    }
  }
</script>
<style scoped>
  .userAvatar {
    position: fixed;
    top: 10px;
    left: 10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  .content {
    width: 80%;
    text-align: left;
    margin: .4% 18%;
  }
  .title {
    font-size: 28px;
    word-wrap: break-word;
    color: #000;
  }
  .contentInfo {
    padding: 1%;
    border-bottom: 1px solid #ccc;
    display: flex;
    font-size: 14px;
  }
  .text {
    margin-left: 2%;
    color: #858585;
  }
  .caozuo {
    margin-top: 10%;
  }
  .button {
    cursor: pointer;
    width: 76px;
    height: 34px;
    border: none;
    line-height: 34px;
    padding-left: 10px;
    background-color: #F5F6F7;
    font-size: 14px;
  }
  .button:hover {
    background-color: #FFF8DC;
  }
  .active {
    color: red;
  }
</style>
