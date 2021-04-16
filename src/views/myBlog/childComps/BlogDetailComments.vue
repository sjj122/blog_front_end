<template>
  <el-card>
    <!--评论编辑框-->
    <div class="commentContent">
      <img v-if="getAvatarUrl" class="avatar" :src="getAvatarUrl">
      <div v-else style="font-size: 12px;width: 45px;">未登录</div>
      <blog-detail-comment-edit :b_id="b_id" @updateComments="updateComments"></blog-detail-comment-edit>
    </div>

    <!--评论内容区域-->
    <div v-if="showComments.length === 0" style="font-size: 14px;">期 待 你 的 神 评 论 ~</div>
    <div v-else class="comment" v-for="(item, index) in showComments"
         :key="item.b_c_id" @mouseenter="mouseenter(index)" @mouseleave="mouseleave">
      <!--评论用户信息与操作-->
      <div class="user-info">
        <div class="info">
          <img class="avatar" :src="item.b_c_avatar">
          <div class="nickname">{{item.b_c_nickname}}</div>
          <div class="time">{{item.b_c_created_time | showDate}}</div>
        </div>

        <!--操作评论-->
        <blog-detail-comments-item :isReply="isReply" :index="index"
        :item="item" :b_id="b_id" @updateComments="updateComments" @showInput="showInput"
        @showReplyList="showReplyList" @deleteComment="deleteComment"></blog-detail-comments-item>

      </div>

      <!--评论内容-->
      <div class="content">{{item.b_c_content}}</div>

      <!--回复评论框-->
      <el-input v-show="isInputShow === index" class="replyInput"
                :placeholder="`回复  ${item.b_c_nickname}`" v-model="commentContent">
        <template slot="append">
          <el-button @click="replyClick(item.b_c_id)">回复</el-button>
        </template>
      </el-input>

      <!--渲染回复评论的内容-->
      <blog-detail-comment-reply v-show="isReplyShow === index"
      :reply="item.b_c_reply" :b_c_nickname="item.b_c_nickname"></blog-detail-comment-reply>

    </div>
  </el-card>
</template>
<script>
  import {mapGetters} from 'vuex'
  import BlogDetailCommentEdit from './BlogDetailCommentEdit'
  import {dateFormatBefore} from '../../../common/utils/dateFormat'

  import BlogDetailCommentsItem from './BlogDetailCommentsItem'
  import BlogDetailCommentReply from './BlogDetailCommentReply'

  import {request} from '../../../network/request'

  export default {
    name: 'BlogDetailComments',
    data () {
      return {
        showComments: [],   // 展示的评论内容
        isReply: -1,        // 需要显示回复的 index,
        isInputShow: -1,    // 是否显示回复评论框，根据评论的下标来定
        isReplyShow: -1,    // 是否显示回复评论内容，根据评论的下标来定

        commentContent: '', // 评论的内容
      }
    },
    props: {
      comments: {
        type: Array,
        default () {
          return []
        }
      },
      b_id: {
        type: String,
        default () {
          return ''
        }
      }
    },
    computed: {
      ...mapGetters(['getAvatarUrl', 'getUserId'])
    },
    methods: {
      // 更新展示的评论列表，不更改props传来的数据
      updateComments (comments) {
        this.showComments = comments
      },
      // 鼠标移进事件
      mouseenter (index) {
        this.isReply = index
      },
      mouseleave () {
        this.isReply = -1
      },

      // 展示回复评论框
      showInput (index) {
        if (this.isInputShow === index) this.isInputShow = -1
        else this.isInputShow = index
      },
      // 回复评论
      async replyClick (b_c_id) {
        if (this.getUserId !== '') {
          if (this.commentContent !== '') {
            const {data: res} = await request({
              url: '/replyCommentContent',
              method: 'post',
              data: {
                b_id: this.b_id,
                b_c_id: b_c_id,
                user_id: this.getUserId,
                content: this.commentContent
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
            this.updateComments(res2.result)
            this.commentContent = ''
          } else {
            this.$message.error('敢问壮士写的是无字天书吗？')
          }
        } else {
          this.$message.error('劳烦壮士先行登录')
        }
      },
      // 查看回复
      showReplyList (index) {
        if (this.isReplyShow === index) this.isReplyShow = -1
        else this.isReplyShow = index
      },

      // 删除评论
      deleteComment (b_c_id) {
        this.$confirm('确认删除此条评论？', '提示')
          .then(async () => {
          const {data: res} = await request({
            url: '/deleteComment',
            method: 'post',
            data: {
              b_c_id: b_c_id,
              b_id: this.b_id
            }
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          this.$message.success('删除成功')
          // 重新请求全新的评论数据
          const {data: res2} = await request({
            url: '/getNewComments',
            method: 'post',
            data: { b_id: this.b_id }
          })
          if (res2.status !== 200) return this.$message.error('出错啦')
          this.updateComments(res2.result)
        })
          .catch(() => this.$message.info('取消删除'))
      }
    },
    components: {
      BlogDetailCommentEdit,
      BlogDetailCommentsItem,
      BlogDetailCommentReply
    },
    filters: {
      showDate (value) {
        return dateFormatBefore(value)
      }
    },
    created () {
      this.showComments = this.comments
    }
  }
</script>
<style scoped>
  .el-card {
    width: 80%;
    text-align: left;
    margin: .4% 18%;
  }
  .commentContent {
    display: flex;
  }
  .comment {
    margin-top: 1%;
    border-bottom: 1px dashed #eee;
  }
  .user-info {
    display: flex;
    justify-content: space-between;
  }
  .info {
    display: flex;
  }
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .nickname {
    font-size: 14px;
    color: #2E2E2E;
  }
  .time {
    font-size: 12px;
    margin-left: 16px;
    margin-top: 1.2%;
    color: #999999;
  }
  .content {
    font-size: 14px;
    color: #4D4D4D;
    margin-top: 8px;
    margin-left: 2.6%;
    margin-bottom: 20px;
  }
  .replyInput {
    width: 96%;
    margin-left: 4%;
    margin-bottom: 1%;
  }
  .replyClick {
    cursor: pointer;
  }
</style>
