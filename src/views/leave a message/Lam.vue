<template>
  <div>
    <!--文本域-->
    <leave-textarea @lam="lam"></leave-textarea>
    <!--最近留言展示，展示四条-->
    <div class="m-card">
      <leave-card v-for="(item, index) in showMessages" :key="item.m_id" :item="item"
      @deleteSuccess="deleteSuccess"></leave-card>
    </div>
    <!--走马灯，我想对大家说的鸡汤-->
    <leave-carousel></leave-carousel>

  </div>
</template>
<script>
  import {getSessionStorage} from '../../common/utils/getSessionStorage'

  import {request} from '../../network/request'

  import LeaveTextarea from './childComps/LeaveTextarea'
  import LeaveCarousel from './childComps/LeaveCarousel'
  import LeaveCard from './childComps/LeaveCard'
  import HomeRightCom from '../home/childComps/HomeRightCom'

  export default {
    name: 'Lam',
    data () {
      return {
        showMessages: [], // 展示到卡片上的留言数据
      }
    },
    components: {
      LeaveTextarea,
      LeaveCarousel,
      LeaveCard,
      HomeRightCom
    },
    methods: {
      // 进行留言
      async lam (message) {
        const {data: res} = await request({
          url: '/lam',
          method: 'post',
          data: message
        })
        if (res.status !== 200) return this.$message.error('出错啦')

        this.getMessages()    // 重新获取数据
      },
      // 请求留言数据
      async getMessages () {
        const {data: res} = await request('/getMessages')
        if (res.status !== 200) return this.$message.error('出错啦')
        let m_arr = res.result.messages, m_user = res.result.user_n_a_arr
        for (let i = 0; i < m_arr.length; ++i) {  // m_arr m_user 这两个数组长度一样，一一对应
          m_arr[i].m_nickname = m_user[i].nickname
          m_arr[i].m_avatar = m_user[i].avatar
        }
        this.showMessages = m_arr
      },
      // 删除成功，请求数据，重新渲染
      deleteSuccess () {
        this.getMessages()
      },
      // 获取sessionStorage里面的内容
      getUserInfoFormSession () {
        if (getSessionStorage()) {
          this.$store.commit('setUserInfo', getSessionStorage())
        }
      }
    },
    created () {
      // 用户刷新页面，依然可以获取到用户信息
      this.getUserInfoFormSession()
      // 请求留言数据
      this.getMessages()
    }
  }
</script>
<style scoped>
  .m-card {
    display: flex;
  }
</style>
