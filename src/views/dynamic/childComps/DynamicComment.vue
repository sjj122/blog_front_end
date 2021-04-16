<template>
  <div>
    <div v-if="commentContent.length === 0">期 待 您 的 神 评 论 ~</div>

    <el-input :placeholder="getNickName === '' ? '先登录才能发言哦' : getNickName + '  说：'" v-model="comment" clearable>
      <el-button slot="append" icon="el-icon-position" title="留言" @click="sendComment"></el-button>
    </el-input>

    <div v-for="(item, index) in commentPageContent" :key="item.comment_id"
         :class="{'comment': true, 'comment_border': !(index === 0)}">
      <!--昵称-->
      <div :class="{'nickname': true, 'nicknameActive': getNickName === item.nickname}">{{item.nickname}} ：</div>
      <!--评论内容-->
      <div class="content">{{item.content}}</div>
      <!--时间与回复按钮-->
      <div class="make">
        <div class="comment-time">{{item.create_time | showDate }}</div>
        <div v-show="getNickName !== '' && getNickName !== item.nickname"
        class="reply" @click="isCommentShowBtn(index)">回复</div>
      </div>
      <!--回复框-->
      <el-input v-show="isCommentShow === index" :placeholder="'回复 ' + item.nickname"
                v-model="comComment" clearable>
        <el-button slot="append" title="回复" @click="reply(item.comment_id)">回复</el-button>
      </el-input>
      <!--回复的内容-->
      <dynamic-com-com :reply="item.reply" :beReplyNN="item.nickname"></dynamic-com-com>
    </div>

    <!--分页-->
    <el-pagination layout="prev, pager, next" :total="commentContent.length"
    :page-size="2" @current-change="currentChange" :hide-on-single-page="true"
    :current-page="currentPage"></el-pagination>

    <!--对话框-->
    <login-form-dialog :showDialog="showDialog" @hideDialog="hideDialog"></login-form-dialog>
  </div>
</template>
<script>
  import {dateFormatBefore} from '../../../common/utils/dateFormat'

  import {request} from '../../../network/request'

  import LoginFormDialog from '../../../common/components/LoginFormDialog'

  import DynamicComCom from './DynamicComCom'

  import {mapGetters} from 'vuex'
  export default {
    name: 'DynamicComment',
    data () {
      return  {
        commentContent: [],     // 当前的所有评论，用户即时刷新评论列表
        commentPageContent: [], // 手动分页的评论显示数组,

        comment: '',            // 绑定用户评论的内容
        isCommentShow: -1,      // 控制回复的输入框显示，存放评论的下标
        showDialog: false,      // 控制模态框的显示与隐藏

        comComment: '',         // 回复内容
        currentPage: 1,         // 当前页
      }
    },
    props: {
      comments: {
        type: Array,
        default () {
          return []
        }
      },
      blog_id: {
        type: String,
        default () {
          return ''
        }
      }
    },
    created () {
      this.commentContent = this.comments
      this.commentPageContent = this.commentContent.slice(0 , 2)
    },
    components: {
      LoginFormDialog,
      DynamicComCom
    },
    computed: {
      ...mapGetters(['getNickName']),
    },
    methods: {
      // 控制回复输入框的显示
      isCommentShowBtn (index) {
        if (this.isCommentShow === index) {
          this.isCommentShow = -1
        } else {
          this.isCommentShow = index
        }
      },
      // 发表评论
      async sendComment () {
        let content = this.comment    // 评论的内容
        let blog_id = this.blog_id
        if (this.$store.state.nickname === '') {
          this.showDialog = true
          return;
        } else {
          if (content === '') {
            this.$message.error('敢问壮士写的是无字天书吗？')
          } else {
            // 有名字，有内容，blog_id
            const {data: res} = await request({
              url: '/comment',
              method: 'post',
              data: {
                blog_id: blog_id,
                nickname: this.getNickName,
                content: content
              }
            })
            if (res.status === 200) {
              // 评论成功，刷新评论数据，根据blog_id请求这个博客的信息
              const {data: newBlog} = await request({
                url: '/getBlogById',
                method: 'post',
                data: {
                  blog_id: blog_id
                }
              })
              this.commentContent = newBlog.result.blog_comments

              // 自动跳转到第一页评论
              this.commentPageContent = this.commentContent.slice(0 , 2)
              this.currentPage = 1

              this.comment = ''
              // 告诉父组件我更新了
              this.$emit('commentUpdate', newBlog.result.blog_comments.length)
            }
          }
        }
      },
      // 接收对话框事件
      hideDialog (params) {
        if (params) {
          // 将 nickname 存入 state 中
          this.$store.commit('setUserInfo', params)
        } else {
          this.showDialog = false
        }
      },
      // 回复按钮的点击
      async reply (comment_id) {
        if (this.comComment === '') return this.$message.error('壮士写的是无字天书吗？')
        let o = {
          comment_id,
          blog_id: this.blog_id,
          nickname: this.getNickName,
          content: this.comComment
        }
        // 发请求
        const {data: res} = await request({
          url: '/replyCom',
          method: 'post',
          data: o
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        // 回复成功，刷新回复列表
        let currentOnlyComment = this.commentContent.find(item => item.comment_id === comment_id)
        currentOnlyComment.reply = res.result.blog_comments.find(item => item.comment_id === comment_id).reply
        // 情况回复输入框
        this.comComment = ''
      },
      // 分页的三个响应事件
      currentChange (page) {
        this.currentPage = page
        this.commentPageContent  = this.commentContent.slice(page * 2 - 2, page * 2)
      }
    },
    filters: {
      // 时间格式化函数，几分钟前
      showDate (value) {  // 对比 value 和 dateNow 两个时间戳
        return dateFormatBefore(value)
      }
    }
  }
</script>
<style scoped>
  .comment {
    margin-bottom: 6px;
    display: flex;
    flex-direction: column;
  }
  .comment_border {
    border-top: 1px solid #eee;
  }
  .nickname {
    font-size: 14px;
    font-weight: 600;
  }
  .nicknameActive {
    color: hotpink;
  }
  .content {
    padding-left: 30px;
  }
  .el-button {
    width: 80px;
  }
  .make {
    width: 300px;
    display: flex;
    justify-content: space-evenly;
    margin-left: 60%;

    align-items: center;
    text-align: center;
    color: #ccc;
  }
  .reply {
    margin-left: 100px;
    margin-right: 20px;
    cursor: pointer;
    border-radius: 6px;
  }
  .reply:hover {
    color: #add8e6;
    background-color: #eee;
  }
</style>
