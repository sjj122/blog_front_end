<template>
  <div class="userInfo" v-if="userInfo.user_id !== undefined">
    <el-card>
      <div class="author">
        <span>作者：</span>
        <el-button v-if="userInfo.user_id !== getUserId"
                   :class="isLike ? 'followBtn grayBtn' : 'followBtn'"
                   @click="addLike"
        >{{ !isLike ? '+关注' : '取消关注' }}</el-button>
      </div>
      <div class="info">
        <img class="avatar" :src="userInfo.avatar">
        <div class="nickname">{{userInfo.nickname}}</div>
      </div>
      <div class="edit">原创文章：
        <el-link type="primary" @click="openUserBlogDrawer">{{userInfo.contents.length}}</el-link> 篇
      </div>
    </el-card>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {request} from '../../../network/request'
  export default {
    name: 'BlogDetailUserInfo',
    data() {
      return {
        isLike: false,    // 是否关注该作者
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
    mounted() {
      // 1.判断是否关注该博主
      this.isLikeJudge()
    },
    methods: {
      openUserBlogDrawer () {
        this.$emit('openUserBlogDrawer')
      },
      // 加关注，再次点击取消关注 --- 先判断是否登录
      async addLike() {
        if (this.getUserId === '') {
          this.$message.warning('劳烦壮士登录先')
        } else {
          const { data: res } = await request({
            url: '/addLike',
            method: 'post',
            data: {
              user_id: this.getUserId,
              belike_user_id: this.userInfo.user_id
            }
          })
          if (res.status !== 200) return this.$message.error('关注失败')
          else {
            if (res.message) this.$message.success('关注成功，该作者有新文章发布会第一时间通知您')
            else this.$message.warning('取关成功')
            // 1.将最新值保存到sessionStorage中
            window.localStorage.setItem('myLike', res.result.myLike)
            // 2.将最新的值赋值到 store 中
            this.$store.commit('setUserMyLike', { myLike: res.result.myLike })
            // 3.重新判断是否关注了
            this.isLikeJudge()
          }
        }
      },
      // 判断用户是否关注了该用户
      isLikeJudge() {
        this.isLike = this.getMyLike.includes(this.userInfo.user_id)
      }
    },
    computed: {
      ...mapGetters(['getUserId', 'getMyLike'])
    }
  }
</script>
<style scoped>
  .userInfo {
    position: fixed;
    width: 16%;
    height: 200px;
    margin-left: 1%;
    margin-top: 4%;
  }

  .author {
    font-size: 14px;
    color: orange;
    padding-bottom: 10px;
    margin-top: -9%;
    margin-left: -6%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .followBtn {
    width: 60px;
    height: 30px;
    padding-right: 10px;
    padding-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: #fd79a8;
    border: 1px solid #eee;
  }
  .grayBtn {
    width: 80px;
    height: 30px;
    background-color: #eee;
    color: #ccc;
  }

  .info {
    display: flex;
  }
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  .nickname {
    font-size: 14px;
    text-align: left;
    height: 20px;
    margin-left: 6%;
  }
  .edit {
    margin-top: 4%;
  }
  .el-link {
    margin-top: -1.5%;
  }
  
</style>
