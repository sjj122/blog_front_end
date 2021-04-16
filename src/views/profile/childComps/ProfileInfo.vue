<template>
  <profile-card>
    <div slot="tip">个人资料</div>
    <div class="main" slot="main">
      <!-- 上半部分 -->
      <div class="top">
        <!-- 1.头像 -->
        <div class="avatar">
          <el-tooltip placement="right">
            <img slot="content" class="preview_avatar" v-lazy="userInfo.avatar"/>
            <img v-lazy="userInfo.avatar" />
          </el-tooltip>
        </div>
        <!-- 2.基本信息 -->
        <div class="info">
          <div class="nickname">
            昵称：<span>{{userInfo.nickname}}</span>
            <el-tag type="danger" size="mini">年费大会员</el-tag>
            <el-tooltip placement="right">
              <el-image slot="content" fit="contain" class="zhifubao" :src="`${returnBaseUrl}/uploads/zhifubao.jpg`"></el-image>
              <span v-if="$route.meta.path !== '/profileVisit'" class="xufei">续费</span>
            </el-tooltip>
          </div>
          <div class="content small_fontsize">{{ userInfo.sign_content }}</div>
          <div class="content">原创文章：<span v-if="userInfo.contents !== undefined">{{userInfo.contents.length}}</span> 篇</div>
          <div class="follow">关注：<span @click="gotoMyFollow">{{ userInfo.myLike.length }}</span> 人</div>
          <!-- visit dialog -->
          <profile-follow-visit-dialog :currentUser="userInfo" :visitDialogVisible="visitDialogVisible" @closeVisitDialog='closeVisitDialog'></profile-follow-visit-dialog>
        </div>
        <!-- 3.想要养成的习惯列表 -->
        <div class="habit" v-if="userInfo !== null">
          <!-- 正在进行的 -->
          <profile-info-habits-tag :class="'habit_item ing'" :userInfo="userInfo" :ing="1"></profile-info-habits-tag>
          <!-- 已养成的 -->
          <profile-info-habits-tag :class="'habit_item ed'" :userInfo="userInfo"></profile-info-habits-tag>
        </div>
      </div>
      <!-- 日历 -->
      <div class="bottom">
        <!-- 日历 -->
        <div class="calendar_container">
          <span class="calendar_title"><span>好习惯养成</span> - 日历</span>
          <el-calendar class="calendar" v-model="date">
            <template slot="dateCell" slot-scope="{ data }">
              <p :class="data.isSelected ? 'is-selected' : ''">
                {{ data.isSelected ? `${data.day.split('-').slice(2)} ✔️` : `${data.day.split('-').slice(2)}`}}
              </p>
            </template>
          </el-calendar>
        </div>
        <!-- 消息版块 -->
        <div class="message"></div>
      </div>
      
    </div>
  </profile-card>
</template>
<script>
  import ProfileCard from './ProfileCard'
  import ProfileInfoHabitsTag from './ProfileInfoHabitsTag'
  import ProfileFollowVisitDialog from './ProfileFollowVisitDialog'
  import { baseUrl } from '@/common/utils/BaseUrl'
  export default {
    name: 'ProfileInfo',
    components: {
      ProfileCard,
      ProfileInfoHabitsTag,
      ProfileFollowVisitDialog
    },
    props: {
      userInfo: {
        type: Object,
        default () {
          return null
        }
      }
    },
    data() {
      return {
        date: new Date(),
        visitDialogVisible: false,  // 控制VisitDialog的显示与隐藏
      }
    },
    mounted() {
      console.log(this.userInfo)
    },
    methods: {
      // 1.去到我关注的页面
      gotoMyFollow() {
        // 在profileVisit路由下显示一个dialog，来显示当前用户所关注的用户列表
        if (this.$route.meta.path === '/profile') this.$emit('gotoFollow', '3')
        else {
          if (this.userInfo.myLike.length === 0) this.$message.warning('他还没有关注任何人')
          else this.visitDialogVisible = true
        }
      },
      // 2.关闭visit模态框
      closeVisitDialog() {
        this.visitDialogVisible = false
      }
    },
    computed: {
      returnBaseUrl() {
        return baseUrl
      }
    }
  }
</script>
<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    padding: 16px;
    overflow: auto;
    height: 443px;
  }
  .main::-webkit-scrollbar {
      width: 5px;
  }
  .main::-webkit-scrollbar-thumb, .main::-webkit-scrollbar-track {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0,0,0,.2);
      background-color: rgba(0,0,0,.2);
  }
  .top {
    display: flex;
    height: 140px;
  }
  /* 头像 */
  .avatar { flex: 1; }
  .avatar > img {
    border-radius: 50%;
    height: 100px;
    width: 100px;
  }
  .preview_avatar {
    height: 240px;
    width: 240px
  }
  /* 信息 */
  .info {
    flex: 3;
    width: 100%;
    font-size: 17px;
    color: #4D4D4D;
  }
  .nickname span {
    color: red;
  }
  .nickname .el-tag {
    margin-left: 1.2%;
  }
  .xufei {
    font-size: 14px;
    color: lightblue;
    text-decoration: underline;
    margin-left: 1.5%;
    margin-top: 2%;
    cursor: pointer;
  }
  .content {
    margin-top: 1%;
  }
  .content span {
    color: orange;
  }
  .small_fontsize {
    font-size: 14px;
  }
  .follow {
    margin-top: 1%;
  }
  .follow span {
    color: #add8e6;
    cursor: pointer;
    text-decoration: underline;
  }
  .zhifubao {
    width: 340px;
    height: 380px;
  }
  /* 习惯 */
  .habit {
    flex: 3;
    width: 420px;
    border: 1px dotted #ccc;
    padding: 10px;
    margin-right: 10px;
    overflow: auto;
    box-shadow: 10px 0px 5px #ccc;
  }
  .habit::-webkit-scrollbar {
      width: 5px;
  }
  .habit::-webkit-scrollbar-thumb, .habit::-webkit-scrollbar-track {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0,0,0,.2);
      background-color: rgba(0,0,0,.2);
  }
  .habit_item {
    display: flex;
    flex-direction: column;
  }
  .habit_item:nth-child(2) { margin-top: 1%; }

  /* 下半部分 */
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /* 日历 -- 好习惯养成记 */
  .calendar_container {
    width: 50%;
    display: flex;
    flex-direction: column;
    margin-top: -2%;
  }
  .calendar_title {
    font-size: 18px;
    letter-spacing: 1px;
    text-align: center;
    border: 1px dashed #ccc;
    border-bottom: none;
  }
  .calendar_title > span { color: #fd79a8; }
  .calendar { border: 1px dashed #ccc; border-bottom: none; }

  /* 消息版块 */
  .message {
    border: 1px dotted #ccc;
    width: 420px;
    min-height: 640px;
    margin-right: 5px;
    margin-top: 28px;
  }
</style>
