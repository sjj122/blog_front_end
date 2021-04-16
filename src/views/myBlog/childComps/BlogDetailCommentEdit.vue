<template>
  <div class="edit">
    <el-input type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
              placeholder="想对作者说点什么.."
              v-model="commentContent" resize="none">
    </el-input>
    <div class="caozuo">
      <div>还可以输入 {{1000 - commentContent.length}} 个字符</div>
      <el-button type="warning" @click="sendComment">发表评论</el-button>
    </div>
  </div>
</template>
<script>
  import {request} from '../../../network/request'
  import {mapGetters} from 'vuex'
  export default {
    name: 'BlogDetailCommentEdit',
    props: {
      b_id: {
        type: String,
        default () {
          return ''
        }
      }
    },
    data () {
      return {
        commentContent: ''
      }
    },
    computed: {
      ...mapGetters(['getUserId'])
    },
    methods: {
      // 发表评论
      async sendComment () {
        if (this.getUserId !== '') {
          if (this.commentContent !== '') {
            const {data: res1} = await request({
              url: '/commentContent',
              method: 'post',
              data: {
                b_id: this.b_id,
                b_c_user_id: this.getUserId,
                b_c_content: this.commentContent
              }
            })
            if (res1.status !== 200) return this.$message.error('出错啦')
            // 重新请求全新的评论数据
            const {data: res2} = await request({
              url: '/getNewComments',
              method: 'post',
              data: { b_id: this.b_id }
            })
            if (res2.status !== 200) return this.$message.error('出错啦')
            this.$message.success('发表成功')
            this.$emit('updateComments', res2.result)
          } else {
            this.$message.error('敢问壮士写的是无字天书吗')
          }
        } else {
          this.$message.error('还请壮士先行登录')
        }
      }
    }
  }
</script>
<style scoped>
  .el-input {
    font-size: 14px;
  }
  .edit {
    width: 100%;
  }
  .caozuo {
    display: flex;
    float: right;
    margin-top: 1.2%;
    width: 229px;
    line-height: 30px;
  }
  .caozuo div {
    font-size: 12px;
    color: #999999;
  }
  .caozuo .el-button {
    height: 30px;
    width: 85px;
    line-height: 2px;
    font-size: 12px;
    margin-left: 5%;
  }
</style>
