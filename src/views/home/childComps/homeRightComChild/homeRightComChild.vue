<template>
  <div class="clickZan" @click="clickZan(item.m_id)">
    <i :class="{'iconfont': true, 'icon-zan': true, 'active': isZanShow}"></i>
    {{item.m_stars.length}}
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {request} from '../../../../network/request'
  export default {
    name: 'homeRightComChild',
    data () {
      return {
        isZanShow: false,   // 是否点过赞
      }
    },
    props: {
      item: {
        type: Object,
        default () {
          return {}
        }
      },
      open: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    methods: {
      // 点赞
      async clickZan (m_id) {
        if (this.getUserId !== '') {
          const {data: res} = await request({
            url: 'zanMessage',
            method: 'post',
            data: {
              "m_id": m_id,
              "user_id": this.getUserId
            }
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          this.isZanShow = !this.isZanShow
          // 告诉父组件让他刷新页面
          this.$emit('refreshTable')
        } else {
          this.$message.error('壮士劳烦您先登录')
        }
      },
      // 检查当前用户是否点过赞，每到下一页就要调用一次
      checkPeopleZan () {
        for (let i = 0; i < this.item.m_stars.length; ++i) {
          if (this.getUserId === this.item.m_stars[i]) {
            this.isZanShow = true
            break
          }
        }
      }
    },
    computed: {
      ...mapGetters(['getUserId'])
    },
    created () {
      this.checkPeopleZan()
    }
  }
</script>
<style scoped>
  .clickZan {
    cursor: pointer;
  }
  .active {
    color: red;
  }
</style>
