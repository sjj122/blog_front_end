<template>
  <div class="textarea">
    <el-input
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 4}"
      placeholder="这位壮士想对 sjj122 说点什么"
      v-model="textarea" resize="none">
    </el-input>
    <el-button type="primary" icon="el-icon-user" @click="leaveAmessage">留    言</el-button>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'LeaveTextarea',
    data () {
      return {
        textarea: ''
      }
    },
    computed: {
      ...mapGetters(['getNickName', 'getUserId', 'getAvatarUrl'])
    },
    methods: {
      // 进行留言
      leaveAmessage () {
        if (this.getUserId === '') {
          this.$message.error('壮士，劳烦您先登录')
        } else {
          if (this.textarea !== '') {
            let o = {
              m_user_id: this.getUserId,    // 之后直接根据id来找到对应的用户
              m_content: this.textarea
            }
            this.textarea = ''
            this.$emit('lam', o)
          } else {
            this.$message.error('敢问壮士写的是无字天书吗？')
          }
        }
      }
    }
  }
</script>
<style scoped>
  .textarea {
    display: flex;
    border: 1px solid deepskyblue;
    border-radius: 6px;
    min-width: 900px;
  }
  .el-button {
    width: 100px;
    margin-left: 9px;
    font-size: 17px;
  }
</style>
