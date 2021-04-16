<template>
  <div id="headerContent">
    <div class="navContainer">

      <div class="left">
        <a class="link" href="/">
          <img class="logo" src="../../assets/pageImg/logo.png" title="sjj122 - 个人博客">
          <span>sjj122 - 个人博客</span>
        </a>
      </div>

      <div class="middle">
        <div class="middle-item-container">
          <ul class="middle-item">
            <li><router-link to="/myBlog" class="rLink">博客</router-link></li>
            <li><router-link to="/dynamic" class="rLink">站主动态</router-link></li>
            <li><router-link to="/myPhoto" class="rLink">照片墙</router-link></li>
            <li><router-link to="/lam" class="rLink">留言板</router-link></li>
          </ul>
        </div>
      </div>

      <div class="right">
        <!--登录前-->
        <div v-if="getUserId === ''" class="loginBefore">
          <span class="right-text1" @click="login">登录</span>
          <span class="right-text1 registerBtn" @click="register">注册</span>
        </div>

        <!--登录后-->
        <div v-else class="right-info">
          <div class="userInfo">
            <img :src="getAvatarUrl" title="更换头像" @click="showAvatarDialog">
            <span class="right-text0" title="个人中心" @click="goToProfile">{{getNickName}}</span>
          </div>

          <span class="right-text2" @click="signout">登出</span>

          <!--写博客-->
          <div class="editBlog" @click="editBlog">
            <i class="iconfont icon-shuxie shuxie"></i>
            <span>写博客</span>
          </div>
        </div>
      </div>

    </div>

    <!--登录框-->
    <login-form-dialog :showDialog="isShowDialog" @hideDialog="hideDialog"></login-form-dialog>

    <!--注册框-->
    <el-drawer
      :visible.sync="isOpen"
      direction="ttb"
      :appendToBody="true"
      size="29%" :with-header="false" :lock-scroll="false">
      <p>壮士喝了这碗酒，欢迎加入 sjj122 江湖！</p>
      <el-input placeholder="称号" v-model="nickname" @blur="checkNickname"></el-input>
      <el-input placeholder="密令" v-model="password" showPassword></el-input>
      <el-input placeholder="确认密令" v-model="rpassword" showPassword></el-input>
      <el-button type="info" @click="cancelRegister">下次一定</el-button>
      <el-button type="primary" @click="confirmRegister">干了！</el-button>
    </el-drawer>

    <!--换头像对话框-->
    <el-dialog
      title="更换头像"
      width="500px"
      :visible.sync="isAvatarDialog"
      :appendToBody="true"
      center @close="cancelChange">
      <el-upload action="" :http-request="uploadAvatar"
          :limit="1" class="avatar-uploader" :show-file-list="false"
          :on-exceed="handleExceed" :before-upload="beforeUpload" accept="image/*" ref="upload">

        <img v-if="imageUrl" :src="imageUrl" class="avatar" title="刚换这张不喜欢？点击更换">
        <div v-else class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>

      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelChange">取 消</el-button>
      <el-button type="primary" @click="changeAvatar">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import LoginFormDialog from './LoginFormDialog'

  import {mapGetters} from 'vuex'

  import {request} from '../../network/request'

  import {baseUrl} from '../../common/utils/BaseUrl'

  export default {
    name: 'HeaderContent',
    inject: ['reload'],
    data () {
      return {
        // 是否显示模态框(登录)
        isShowDialog: false,
        // 是否打开抽屉(注册)
        isOpen: false,

        // 注册的信息
        nickname: '',
        password: '',
        rpassword: '',
        nicknameIsExit: false,   // 用户名是否存在，默认不存在

        isAvatarDialog: false,   // 换头像对话框隐藏与显示
        imageUrl: '',            // 当前组件中头像路径

      }
    },
    components: {
      LoginFormDialog
    },
    computed: {
      ...mapGetters(['getNickName', 'getAvatarUrl', 'getUserId']),
    },
    methods: {
      login () {
        // 打开模态框
        this.isShowDialog = true
      },
      hideDialog (params) {
        if (params) {
          this.$store.commit('setUserInfo', params)
        }
        this.isShowDialog = false
      },
      // 注册按钮的点击打开注册面板
      register () {
        this.isOpen = true
      },
      // 取消注册
      cancelRegister () {
        this.isOpen = false
      },
      // 检验用户名是否被使用
      async checkNickname () {
        if (this.nickname !== '') {
          const {data: res} = await request({
            url: '/checkNickname',
            method: 'post',
            data: {
              nickname: this.nickname
            }
          })
          if (res.status === 500) this.$message.error('出错啦')
          else if (res.status === 400) {
            this.nicknameIsExit = true
            this.$message.error('抱歉壮士，此称号已被他人使用了')
          }
          else if (res.status === 200) {
            this.nicknameIsExit = false
            this.$message.success('称号合法')
          }
        }
      },
      // 确认注册
      async confirmRegister () {
        // 注册完成后进行登录
        if (this.nickname === '' || this.password === '' || this.rpassword === '') {
          this.$message.error('敢问壮士写的是无字天书吗？')
        } else {
          if (this.password !== this.rpassword) {
            this.$message.warning('两次密令不一样哦')
          } else {
            if (!this.nicknameIsExit) {  // 用户名不一样可以注册
              // 发送注册请求
              const {data: res} = await request({
                url: '/register',
                method: 'post',
                data: {
                  nickname: this.nickname,
                  password: this.password
                }
              })
              if (res.status !== 200) return this.$message.error('出错啦，注册失败')

              this.$message({
                message: '加入成功',
                duration: 1000,
                type: 'success'
              })
              this.$message({
                message: '自动登录中',
                duration: 1000,
                type: 'info'
              })
              // 成功，自动给他登录一下
              const {data: signRes} = await request({
                url: '/sign',
                method: 'post',
                data: {
                  nickname: this.nickname,
                  password: this.password
                }
              })
              if (signRes.status !== 200) return this.$message.error('出错啦')
              this.$message.success('壮士久仰大名，如雷贯耳')
              // 1.将数据取出
              const { user_id, nickname, myLike, avatar } = signRes.result
              // 2.存入store
              this.$store.commit('setUserInfo', {
                user_id: user_id,
                nickname: nickname,
                avatar: avatar,
                myLike: myLike
              })
              // 3.存入到sessionStorage中去
              window.localStorage.setItem('user_id', user_id)
              window.localStorage.setItem('nickname', nickname)
              window.localStorage.setItem('myLike', myLike)
              window.localStorage.setItem('avatar', avatar)
              this.isOpen = false
            } else {
              this.$message.error('壮士请换个称号哦')
            }
          }
        }
      },
      // 登出
      signout () {
        this.$confirm('确认登出？', '提示')
          .then(() => {
            this.$store.commit('clearUserInfo')
            this.$message.success('登出成功')
            window.localStorage.clear()
            this.reload()
            // 如果在个人页面登出，就跳转到首页
            let reg = /profile/g
            if (reg.test(this.$route.path)) {
              this.$router.replace('/')
            }
          }).catch(() => {
          this.$message.info('已取消登出')
        })

      },
      // 打开换头像的对话框
      showAvatarDialog () {
        this.isAvatarDialog = true
      },

      // 上传文件前进行类型判断
      beforeUpload (file) {
        const type = file.type
        const reg = /image\/(jpg|bmp|ico|gif|jpeg|png)/
        if (!reg.test(type)) {
          this.$message.error('文件类型只能是图片哦')
          return false
        }
      },
      // 上传头像(文件类型检测，超出限制删除之前上传的)
      async uploadAvatar () {
        const formdata = new FormData()
        const file = this.$refs.upload.uploadFiles[0].raw
        const headers = { 'Content-Type': 'multipart/form-data' }

        formdata.append('avatar', file)

        const {data: res} = await request({
          url: '/upAvatar',
          method: 'post',
          headers: headers,
          data: formdata
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        // 成功，获得图片的地址，拼接为完整地址
        let reg = /\\/g
        let resUrl = res.result.replace(reg, '/')
        this.imageUrl = `${baseUrl}/${resUrl}`
        this.$message.success('上传成功')
      },
      // 点击确定存入数据库  avatarUrl
      async changeAvatar () {
        const {data: res} = await request({
          url: '/saveAvatarUrl',
          method: 'post',
          data: {
            user_id: this.getUserId,
            avatarUrl: this.imageUrl
          }
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        this.$message.success('头像修改成功')
        this.$refs.upload.uploadFiles.splice(0, 1)
        this.isAvatarDialog = false
        // 将最新的头像赋值到vuex中
        this.$store.commit('setUserAvatar', { imageUrl: this.imageUrl })
        // 存入sessionStorage
        window.localStorage.setItem('avatar', this.imageUrl)
        this.imageUrl = ''
      },
      // 文件超出，用户意在替换当前上传的文件(此时文件路径还没有保存到数据库中)
      handleExceed (files, fileList) {
        this.$refs.upload.uploadFiles[0].raw = files[0]
        this.uploadAvatar()
      },
      // 取消上传
      cancelChange () {
        this.imageUrl = ''
        this.$refs.upload.uploadFiles.splice(0, 1)
        this.isAvatarDialog = false
      },

      // 跳转到写博客页面
      editBlog () {
        this.$router.push(`/editBlog/${-1}`)
      },

      // 跳转到个人页面（防止重复点击）
      goToProfile () {
        if (!/\/profile\/.*?/.test(this.$route.path)) {
          this.$router.push(`/profile/${this.getUserId}`)
        }
      }
    }
  }
</script>
<style scoped>
  #headerContent {
    height: 60px;
    width: 100%;
    min-width: 1200px;
    border-bottom: 2px solid #eee;
    box-shadow: 0 4px 5px #eee;
    background-color: black;

    position: fixed;
    top: 0;
    z-index: 2;
  }
  .navContainer { /* 三部分都相对于这个绝对定位 */
    display: flex;
    width: 100%;
    height: 60px;
   }
  .left {
    flex: 2;
    height: 60px;
  }
  .link {
    text-decoration: none;
    line-height: 30px;
  }
  .logo {
    width: 95px;
    height: 55px;
    padding-left: 12px;
  }
  .link span {
    position: absolute;
    width: 200px;
    height: 60px;
    font-size: 22px;
    line-height: 60px;
    padding-left: 12px;
    color: white;
  }


  .middle {
    flex: 3;
  }
  .middle-item-container {
    position: relative;
    margin-left: 20%;
  }
  .middle-item {
    height: 60px;
    position: absolute;
    list-style: none;
    left: 0;
    top: 0;
    bottom: 0;
  }
  .middle-item li {
    display: inline-block;
    font-size: 20px;
  }
  .middle-item li:nth-child(2) {
    padding-left: 16px;
  }
  .middle-item li:nth-child(3) {
    padding-left: 16px;
  }
  .middle-item li:nth-child(4) {
    padding-left: 16px;
  }
  .rLink {
    text-decoration: none;
    color: white;
    transition: all .5s ease;
    padding: 10px;
  }
  .router-link-active {
    background-color: orange;
  }

  .right {
    flex: 1;
    text-align: center;
  }

  .loginBefore {
    margin-top: 35px;
  }
  .right-text1 { /* 登录 *//* 注册 */
    color: white;
    font-size: 17px;
    cursor: pointer;
  }
  .registerBtn {
    margin-left: 20px;
  }
  /* 头像，昵称，登出 */
  .right-info {
    display: flex;
    justify-content: space-evenly;
  }
  .userInfo {
    display: flex;
    flex-direction: column;
  }
  .right-text0 { /* 昵称 */
    color: white;
    font-size: 17px;
    cursor: pointer;
  }
  .userInfo img {
    width: 36px;
    height: 36px;
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid #fff;
    margin: 0 auto;
  }
  .right-text2 { /* 登出 */
    color: white;
    font-size: 14px;
    cursor: pointer;
    height: 20px;
    width: 36px;
    margin-top: 40px;
    margin-left: 15px;
  }
  .editBlog {
    color: white;
    width: 70px;
    height: 60px;
    margin-right: 6px;
    text-align: center;
    line-height: 96px;
    font-size: 17px;
    cursor: pointer;
  }
  .editBlog:hover {
    background-color: #fff;
    color: black;
  }
  .editBlog:hover>.shuxie {
    color: black;
  }
  .shuxie {
    color: white;
    font-size: 12px;
  }

  /*注册框*/
  .el-drawer p {
    margin-left: 20px;
    font-size: 18px;
  }
  .el-input {
    width: 300px;
    margin-right: 6px;
    margin-left: 12px;
  }
  .dialogAvatar {
    margin-left: 36%;
  }

  .avatar {
    width: 140px;
    height: 140px;
  }
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    width: 140px;
    height: 140px;
    margin-left: 34.4%;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
</style>
