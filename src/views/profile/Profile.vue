<template>
  <div class="profile" v-if="userInfo.nickname !== undefined && isShowProfile">
    <!--导航-->
    <profile-menu @select="selectWho"></profile-menu>
    <!--信息卡-->
    <profile-info v-if="getShowWho === '1'" :userInfo="userInfo" @gotoFollow="selectWho"></profile-info>

    <!--博客卡-->
    <profile-blog v-if="getShowWho === '2'" :userInfo="userInfo"></profile-blog>

    <!-- 关注卡 -->
    <profile-follow  v-if="getShowWho === '3' && $route.meta.path === '/profile'" :userInfo="userInfo"></profile-follow>

    <!-- 照片卡 -->
    <profile-photo v-if="getShowWho === '4' && $route.meta.path === '/profile'" :userInfo="userInfo"></profile-photo>

    <!-- 发布动态卡 -- 站主才会显示此项 -->
    <profile-action v-if="getShowWho === '5' && $route.meta.path === '/profile' && userInfo.nickname.trim() === 'sjj'" :userInfo="userInfo"></profile-action>
  </div>
</template>
<script>
  import {getSessionStorage} from '../../common/utils/getSessionStorage'
  import { mapGetters } from 'vuex'
  import {request} from '../../network/request'

  import ProfileMenu from './childComps/ProfileMenu'
  import ProfileInfo from './childComps/ProfileInfo'
  import ProfileBlog from './childComps/ProfileBlog'
  import ProfileFollow from './childComps/ProfileFollow'
  import ProfilePhoto from './childComps/ProfilePhoto'
  import ProfileAction from './childComps/ProflieAction'
  export default {
    name: 'Profile',
    components: {
      ProfileMenu,
      ProfileInfo,
      ProfileBlog,
      ProfileFollow,
      ProfilePhoto,
      ProfileAction
    },
    data () {
      return {
        isShowProfile: true,  // 控制profile的刷新
        user_id: '',          // 有 profile 进来获取到的 user_id
        to_user_id: '',       // 有 profileVisit 进来获取到的 to_user_id

        userInfo: {},
        path: '',             // 记录当前游览的visit path，再次刷新不提示
      }
    },
    computed: {
      ...mapGetters(['getShowWho', 'getUserId'])
    },
    watch: {
      // 监听路由变化，防止组件数据重用
      $route(to, from) {
        this.user_id = this.getUserId
        if ((to.meta.path === '/profileVisit' && to.params.user_id !== from.params.user_id) || to.path === `/profile/${this.user_id}`) {
          this.isShowProfile = false              // 隐藏主面板，暗地里加载数据
          if (this.$route.meta.path === '/profileVisit') this.to_user_id = to.params.user_id
          this.getUserInfoById() // 拉取需要访问的用户数据
          this.$store.commit('setShowWho', '1')
        }
      }
    },
    methods: {
      // 根据id获取用户数据
      async getUserInfoById() {
        const {data: res} = await request({
          url: '/getUserById',
          method: 'post',
          data: { user_id: this.$route.meta.path === '/profile' ? this.user_id : this.to_user_id }
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        this.userInfo = res.result
        this.showNotification(res.result.nickname) // 提示
        this.isShowProfile = true                  // 数据加载完毕，显示主面板
      },
      // 菜单改变
      selectWho(index) {
        this.$store.commit('setShowWho', index)
      },
      // 获取localStorage里面的内容
      getUserInfoFormSession() {
        if (getSessionStorage()) {
          this.$store.commit('setUserInfo', getSessionStorage())
        }
      },
      // notification 提示
      showNotification(nickname) {
        if (this.$route.meta.path === '/profileVisit' && this.path !== this.$route.fullPath) {
          this.$notify.info({
            title: '通知',
            message: `您正在游览 <span style="color: red;">${nickname}</span> 的个人主页`,
            dangerouslyUseHTMLString: true,
            position: 'bottom-right',
            showClose: true,
            duration: 4000
          })
        }
        this.path = this.$route.fullPath
      }
    },
    created() {
      // 处理刚进来这个页面 或者 是在当前页面刷新
      if (this.$route.meta.path === '/profile') this.user_id = this.$route.params.user_id
      else if (this.$route.meta.path === '/profileVisit') this.to_user_id = this.$route.params.user_id

      this.getUserInfoById()
      this.getUserInfoFormSession()
    },
    destroyed() {
      this.path = ''
    }
  }
</script>
<style scoped>
  .profile {
    display: flex;
    margin-top: 60px;
  }
</style>
