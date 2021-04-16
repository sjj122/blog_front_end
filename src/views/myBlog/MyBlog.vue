<template>
  <div>

    <div class="middle">
      <blog-card class="middle-item" v-for="(item, index) in contentList" :key="index"
      :item="item"></blog-card>
    </div>

    <!--回到顶部-->
    <back-top></back-top>

  </div>
</template>
<script>
  import {request} from  '../../network/request'

  import {getSessionStorage} from '../../common/utils/getSessionStorage'

  import {mapGetters} from 'vuex'

  import BlogCard from './childComps/BlogCard'
  import BackTop from '../../common/components/BackTop'
  export default {
    name: 'MyBlog',
    data () {
      return {
        contentList: [],

        page: 1,          // 当前页码数
        count: 0,         // 博客总篇数
        // 记录上一次的滑动距离，用与判断用户是上滑还是下滑
        lastOffsetY: 0,

        arrValue: [0, 1, 2, 3, 4, 5], // 滑动取余的取值范围
        requestFlag: false,           // 正在发送请求，默认false没在发送，发送期间不允许重复发送

        timer: null,                  // scroll 防抖操作
      }
    },
    components: {
      BlogCard,
      BackTop
    },
    computed: {
      ...mapGetters(['getNickName', 'getUserId'])
    },
    methods: {
      // 获取博客总篇数
      async getContentCount () {
        const {data: res} = await request('/getContentCounts')
        if (res.status !== 200) return this.$message.error('出错啦')
        this.count = res.result
      },
      // 获取置顶文章
      async getTopContent () {
        const {data: res} = await request('/getTopContent')
        if (res.status !== 200) return this.$message.error('出错啦')
        this.contentList.unshift(res.result)
      },
      // 获取博客信息(传过去page和pageSize)
      async getContentList () {
        const {data: res} = await request({
          url: '/contents',
          method: 'post',
          data: {
            page: this.page,
            pageSize: 6
          }
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        this.contentList.push(...res.result)
        this.requestFlag = false      // 请求完毕，打开开关，可以再次上拉加载更多
      },
      // 获取sessionStorage里面的内容
      getUserInfoFormSession () {
        if (getSessionStorage()) {
          this.$store.commit('setUserInfo', getSessionStorage())
        }
      },
      // 上拉加载更多
      pullUpLoadMore() {
        window.addEventListener('scroll', this.scroll)
      },
      // 滚动事件（滚动 200个px 就加载一次） --- 防抖
      scroll () {
        const distance = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (distance >= 200 && this.contentList.length < this.count  && this.requestFlag === false && distance - this.lastOffsetY > 0) {  // 过滤掉上滑
          const value = distance % 200
          this.arrValue.forEach(item => {
            if (item === value) {
              // 进来一次 page + 1
              this.page++
              this.requestFlag = true
              // 发送分页请求
              this.getContentList()
            }
          })
        }

        this.lastOffsetY = distance
      } 
    },
    created () {
      this.getContentCount()        // 获取文章总篇数
      this.getTopContent()          // 获取置顶文章
      this.getContentList()         // 分页获取文章数据
      this.getUserInfoFormSession() // 获取登录用户的信息
    },
    mounted () {
      this.pullUpLoadMore()
    }
  }
</script>
<style scoped>
  .middle-item {
    margin-top: .24rem;
    margin-bottom: .12rem;
  }
</style>
