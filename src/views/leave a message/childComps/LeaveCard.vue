<template>
  <div class="cardClass">
    <el-card class="cardAnimation">
      <i v-if="isShowDelete" class="el-icon-close posit" @click="deleteAMessage"></i>
      <img class="tuding" src="../../../assets/pageImg/圆形.svg" alt="">
      <div class="people-info">
        <img :src="showMessageItem.m_avatar">
        <div class="nickname">{{showMessageItem.m_nickname}}</div>
      </div>
      <div class="content">{{content}}</div>
      <div class="time">{{showMessageItem.m_created_time | showDate}}</div>
      <div class="zan" @click="clickZan">
        <i :class="{'iconfont': true, 'icon-zan': true, 'active': isZanShow}"></i>
        {{showMessageItem.m_stars.length}}
      </div>
    </el-card>
  </div>
</template>
<script>
  import {dateFormat} from '../../../common/utils/dateFormat'

  import {request} from '../../../network/request'

  import {mapGetters} from 'vuex'

  export default {
    name: 'LeaveCard',
    data () {
      return {
        isZanShow: false,

        // 展示的消息元素
        showMessageItem: {}
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
      ...mapGetters(['getUserId']),
      content () {
        return this.item.m_content.length > 52 ?
          this.item.m_content.substring(0, 52) + '...' : this.item.m_content
      },
      isShowDelete () {
        return this.getUserId === this.item.m_user_id
      }
    },
    filters: {
      showDate (value) {
        let date = new Date(value)
        return dateFormat(date, 'MM-dd hh:mm')
      }
    },
    methods: {
      // 用户可以删除自己的留言
      deleteAMessage () {
        this.$confirm('是否删除该条留言？', '提示')
          .then(async () => {
            const {data: res} = await request({
              url: '/deleteMessage',
              method: 'post',
              data: { "m_id": this.item.m_id }
            })
            if (res.status !== 200) return this.$message.error('出错啦')
            this.$emit('deleteSuccess') // 告诉父组件删除成功，需要重新渲染
            this.$message.success('删除成功')
          })
          .catch(() => {
            this.$message({
              message: '已取消删除',
              type: 'info',
              duration: 1000
            })
          })
      },
      // 检查是否被点赞
      checkCardZan () {
        if (this.getUserId !== '') {
          for (let i of this.item.m_stars) {
            if (i === window.localStorage.getItem('user_id')) {
              this.isZanShow = true
              break
            }
          }
        }
      },
      // 点赞留言
      async clickZan () {
        if (this.getUserId !== '') {
          const {data: res} = await request({
            url: 'zanMessage',
            method: 'post',
            data: {
              "m_id": this.item.m_id,
              "user_id": this.getUserId
            }
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          this.showMessageItem.m_stars = res.result.m_stars
          this.isZanShow = !this.isZanShow
        } else {
          this.$message.error('壮士劳烦您先登录')
        }
      },
    },
    created () {
      this.showMessageItem = this.item
      this.checkCardZan()
    }
  }
</script>
<style scoped>
  .cardClass {
    margin-right: 6%;
    margin-left: 1.4%;
  }
  .posit {
    position: absolute;
    margin-left: -16px;
    margin-top: -16px;
    cursor: pointer;
    font-size: 14px;
  }
  .tuding {
    width: 18px;
    height: 18px;
    position: absolute;
    margin-top: -18px;
    margin-left: 128px;
    background-color: #fff;
    border-radius: 50%;
  }
  .el-card {
    width: 169px;
    height: 220px;
    margin-top: 4px;
    background-color: #FFFAF0;
  }
  .people-info {
    display: flex;
  }
  .people-info img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
  .people-info .nickname {
    padding-left: 4px;
    font-size: 12px;
    color: blueviolet;
  }
  .content {
    font-size: 14px;
    margin-top: 6px;
    height: 116px;
    border-bottom: 1px dashed #ccc;
  }
  .time {
    font-size: 14px;
    float: left;
    margin-top: 12px;
  }
  .zan {
    font-size: 14px;
    float: right;
    margin-top: 12px;
    cursor: pointer;
  }
  .zan img {
    width: 19px;
    height: 19px;
  }
  /*动画*/
  .cardAnimation {
    animation-name: fade;
    animation-timing-function: ease;
    animation-duration: 1s;
  }
  @keyframes fade {
    0% {
      opacity: 0;
      transform: translateX(-29px);
    }
    100% {
      opacity: 1;
    }
  }
  .active {
    color: red;
  }
</style>
