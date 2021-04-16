<template>
  <el-dialog title="敢问壮士江湖人称？(登录)" :visible="showDialog"
             :show-close="false" :append-to-body="true" :lock-scroll="false">
    <el-input v-model="nickname" placeholder="称号"></el-input>
    <el-input v-model="password" placeholder="密令" @keydown.native.enter="hideDialog('confirm')" showPassword></el-input>
    <div slot="footer">
      <el-button @click="hideDialog">就不告诉你~</el-button>
      <el-button type="primary" @click="hideDialog('confirm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {request} from '../../network/request'

  export default {
    name: 'LoginFormDialog',
    inject: ['reload'],
    data () {
      return {
        nickname: '',
        password: '',
      }
    },
    props: {
      showDialog: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    methods: {
      // 发送登录请求
      async hideDialog (confirm) {
        if (confirm === 'confirm') {
          // 点击了确定按钮
          if (this.nickname === '' || this.password === '') {
            // 输入不能为空
            this.$message({
              message: '壮士！您写的是无字天书吗？',
              type: 'warning'
            })
            return;
          } else {
            // 发请求，验证用户名密码是否正确
            const {data: res} = await request({
              url: '/sign',
              method: 'post',
              data: {
                nickname: this.nickname,
                password: this.password
              }
            })
            if (res.status === 404) {
              return this.$message.error('抱歉，本武林好像没有你的留名')
            }
            this.$message({
              showClose: true,
              message: '壮士！久仰大名，如雷贯耳',
              type: 'success',
              duration: 2000
            })
            this.$emit('hideDialog', res.result)
            // 存入sessionStorage里面去
            window.localStorage.setItem('user_id', res.result.user_id)
            window.localStorage.setItem('nickname', res.result.nickname)
            window.localStorage.setItem('avatar', res.result.avatar)
            window.localStorage.setItem('myLike', res.result.myLike)
            // 刷新整个页面
            this.reload()
          }
        }
        this.$emit('hideDialog')
      }
    }
  }
</script>
<style scoped>
  .el-input {
    margin-top: 10px;
  }
</style>
