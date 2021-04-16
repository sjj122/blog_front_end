<template>
  <div class="dynamic-list">
    <dynamic-title></dynamic-title>
    <div class="list-item">
      <dynamic-list :list="myDynamic"></dynamic-list>
      <dynamic-load-more ref="loadmore" :status="status"></dynamic-load-more>
    </div>

    <back-top></back-top>
  </div>
</template>
<script>
  import {getSessionStorage} from '../../common/utils/getSessionStorage'

  import DynamicTitle from './childComps/DynamicTitle'
  import DynamicList from './childComps/DynamicList'
  import DynamicLoadMore from './childComps/DynamicLoadMore'

  import BackTop from '../../common/components/BackTop'

  import {request} from '../../network/request'
  export default {
    name: 'Dynamic',
    data () {
      return {
        myDynamic: [],

        // 当前的页数
        page: 1,
        // 防止一直发请求 --- 为 true 的时候，此时不能请求动态数据
        prevent: false,
        // 没有更多数据了，提示 --- 为 true 的时候进行提示
        status: false
      }
    },
    components: {
      DynamicTitle,
      DynamicList,
      DynamicLoadMore,
      BackTop
    },
    methods: {
      // 1.获取sessionStorage里面的内容
      getUserInfoFormSession () {
        if (getSessionStorage()) {
          this.$store.commit('setUserInfo', getSessionStorage())
        }
      },
      // 2.获取站主动态数据
      async getDynamicData() {
        const {data: res} = await request({
          url: '/dynamic',
          method: 'post',
          data: {
            page: this.page,
            pageSize: 3
          }
        })
        if (res.status !== 200) return this.$message.error('网络错误')
        if (res.result.length === 0) {
          // 没有更多数据了
          // 不将prevent重置
          this.status = true
        } else {
          // 按时间排序，优先显示最近的动态
          this.myDynamic.push(...res.result)
          setTimeout(() => this.prevent = false, 1000) // 防止频繁获取数据
        }
       },
       // 3.监听是否滑动到 loadmore 组件，滑到了就进行加载更多
       listenLoadMore() {
         const height = window.innerHeight
         const ele = this.$refs.loadmore
         const eleH = ele.$el.clientHeight
         document.addEventListener('scroll', e => {
           // top < scrollY(卷去的高度) + innerHeight(视口高度)  就视为元素出现在用户可见区
           const { top } = ele.$el.getBoundingClientRect()
           const scrollY = window.pageYOffset
           if (top < scrollY + height + eleH) {
             if (!this.prevent) {
               this.prevent = true
               this.page++
               // 发请求
               this.getDynamicData()
             }
           }
         })
       }
    },
    created () {
      this.getUserInfoFormSession()

      this.getDynamicData()
    },
    mounted() {
      this.listenLoadMore()
    }
  }
</script>
<style scoped>
</style>
