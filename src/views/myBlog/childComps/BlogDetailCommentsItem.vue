<template>
  <div class="user-caozuo">
    <span class="delete" @click="deleteComment" v-show="showDelete">删除</span>
    <span class="reply" @click="showReplyInput" v-show="isReply === index">回复</span>
    <span class="lookReply" @click="showReplyList">{{showReply}}</span>
    <span class="zanIcon" @click="zanCommentContent">
      <i :class="{'iconfont': true, 'icon-zan': true, 'active': isCommentZan}"></i>  {{item.b_c_stars.length}}
    </span>
  </div>
</template>
<script>
  import {request} from '../../../network/request'
  import {mapGetters} from 'vuex'
  export default {
    name: 'BlogDetailCommentsItem',
    data () {
      return {
        isCommentZan: false,  // 评论是否被点赞
      }
    },
    props: {
      isReply: {
        type: Number,
        default () {
          return -1
        }
      },
      index: {
        type: Number,
        default () {
          return -1
        }
      },
      item: {
        type: Object,
        default () {
          return {}
        }
      },
      b_id: {
        type: String,
        default () {
          return ''
        }
      },
    },
    computed: {
      ...mapGetters(['getUserId', 'getNickName']),
      // 显示查看回复
      showReply () {
        return this.item.b_c_reply.length === 0 ? '' : `查看回复(${this.item.b_c_reply.length})`
      },
      // 显示删除按钮
      showDelete () {
        return this.getNickName === this.item.b_c_nickname && this.isReply === this.index
      }
    },
    methods: {
      // 给评论点赞
      async zanCommentContent () {
        if (this.getUserId !== '') {
          const {data: res} = await request({
            url: '/zanCommentContent',
            method: 'post',
            data: {
              b_id: this.b_id,
              b_c_id: this.item.b_c_id,
              user_id: this.getUserId
            }
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          // 重新请求全新的评论数据
          const {data: res2} = await request({
            url: '/getNewComments',
            method: 'post',
            data: { b_id: this.b_id }
          })
          if (res2.status !== 200) return this.$message.error('出错啦')
          this.$emit('updateComments', res2.result)
          this.isCommentZan = !this.isCommentZan
        } else {
          this.$message.error('还请壮士先行登录')
        }
      },
      // 判断是否点过赞
      checkZan () {
        if (this.getUserId !== '') {
          for (let i of this.item.b_c_stars) {
            if (i === window.localStorage.getItem('user_id')) {
              this.isCommentZan = true
              break
            }
          }
        }
      },
      // 展示回复评论框
      showReplyInput () {
        this.$emit('showInput', this.index)
      },
      // 查看回复
      showReplyList () {
        this.$emit("showReplyList", this.index)
      },
      // 删除评论事件
      deleteComment () {
        this.$emit('deleteComment', this.item.b_c_id)
      }
    },
    created () {
      this.checkZan()
    }
  }
</script>
<style scoped>
  .user-caozuo {
    font-size: 12px;
    display: flex;
    margin-top: 1%;
    width: 220px;
  }
  .delete {
    color: deepskyblue;
    cursor: pointer;
    position: absolute;
  }
  .reply {
    color: deepskyblue;
    cursor: pointer;
    position: absolute;
    margin-left: 3.2%;
  }
  .lookReply {
    color: deepskyblue;
    cursor: pointer;
    position: absolute;
    margin-left: 6.4%;
  }
  .zanIcon {
    margin-left: 76%;
    cursor: pointer;
  }
  .active {
    color: red;
  }
</style>
