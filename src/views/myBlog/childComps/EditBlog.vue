<template>
  <div class="edit">
    <!--文本编辑头-->
    <div class="editTop">
      <div><i class="el-icon-arrow-left iFont" title="返回" @click="backHome"></i></div>
      <el-input placeholder="请输入文章的标题" v-model="title" :maxlength="100">
        <template slot="append">{{title.length}} / 100</template>
      </el-input>
      <el-button type="info">保存草稿</el-button>
      <el-button v-if="$route.params.b_id === '-1'" type="danger" @click="sendContent" :disabled="isOpen" :title="isOpen ? '请输入文章标题' : '发布'">发布文章</el-button>
      <el-button v-else type="danger" @click="modifyContent" :disabled="isOpen">确认修改</el-button>
      <div class="avatar"><img :src="getAvatarUrl"/></div>
    </div>

    <div class="editArea">
      <!--富文本编辑区-->
      <mavon-editor ref="mavon" class="mavonEdit"
                    @imgAdd="$imgAdd" @change="changeData" @save="saveData" v-model="content"></mavon-editor>
    </div>

    <!--全屏蒙版，提示区域，继续编辑不显示（都是老顾客了）-->
    <div class="EditTip" v-if="EditTipIsShow && $route.params.b_id === '-1'" @click="closeTip">
      <div class="tipTop">
        <div class="tipTitle"></div>
        <div class="tipSend"></div>
      </div>
      <div class="tipText tipTextAll">
        <div class="tipTitleText">在这里输入标题~</div>
        <div class="tipSendText">点击这里发布文章~</div>
      </div>

      <!--编写及预览区-->
      <div class="tipBottom tipTextAll">
        <div class="tipWrite">左侧是编辑区</div>
        <div class="tipTransition">
          <div class="iDiv">
            <i class="iconfont icon-jiantou iSize leftArrow"></i>
            <i class="iconfont icon-jiantou iSize"></i>
          </div>
          <div class="iKnow">我知道了</div>
        </div>
        <div class="tipPreview">右侧可以实时预览</div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  import {request} from '../../../network/request'

  import {getSessionStorage} from '../../../common/utils/getSessionStorage'
  import {toolbarOptions} from '../../../common/utils/toolbarOptions'
  import {baseUrl} from '../../../common/utils/BaseUrl'

  export default {
    name: 'EditBlog',
    data () {
      return {
        content: '',    // md格式的文章

        htmlIng: '',    // 修改就会改变的HTML代码
        htmlEnd: '',    // 最终保存的HTML代码

        title: '',      // 文章标题

        EditTipIsShow: true,  // 打开默认显示

        b_id: this.$route.params.b_id,    // 获取传进来的文章id
        contentInfo: {},                  // 请求回来的文章
      }
    },
    computed: {
      ...mapGetters(['getUserId', 'getAvatarUrl']),
      // 控制是否可以发布，必须填写文章标题
      isOpen () {
        return this.title === ''
      }
    },
    methods: {
      // 返回，提示用户不会自动保存
      backHome () {
        this.$confirm('系统可能不会保存你的任何更改', '提示')
          .then(() => {
            this.$router.back()
          })
      },
      // 上传图片
      async $imgAdd (index, file) {
        let formData = new FormData()
        formData.append('img', file)
        const {data: res} = await request({
          url: '/upContentImg',
          method: 'post',
          headers: { "Content-Type": "multipart/form-data" },
          data: formData
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        // 对图片的路径进行加工
        let reg = /\\/g
        let url = `${baseUrl}/` + res.result.replace(reg, '/')
        this.$refs.mavon.$img2Url(index, url)
      },
      // 监听每一次修改内容的HTML代码
      changeData (value, render) {
        this.htmlIng = render
      },
      // 最后 ctrl+s 保存的HTML代码
      saveData (value, render) {
        this.htmlEnd = render
      },
      // 发布文章
      async sendContent () {
        if (this.getUserId !== '') {
          if (this.content !== '') {
            if (this.htmlIng === this.htmlEnd) {
              const {data: res} = await request({
                url: '/saveContent',
                method: 'post',
                data: {
                  "b_user_id": this.getUserId,
                  "b_title": this.title,
                  "b_content_md": this.content,
                  "b_content_html": this.htmlEnd
                }
              })
              if (res.status !== 200) return this.$message.error('出错啦')
              this.$message.success('发布成功')
              this.$router.replace(`/myBlog`)
            } else {
              this.$message.warning('壮士别忘记 ctrl + s 保存哦')
            }
          } else {
            this.$message.error('敢问壮士写的是无字天书吗？')
          }
        } else {
          this.$message.error('请壮士先登录')
          this.$router.replace(`/myBlog`)
        }
      },
      // 关闭蒙版提示
      closeTip () {
        this.EditTipIsShow = false
      },
      // 根据文章id获取文章信息
      async getContentById () {
        if (this.b_id !== '-1') {
          const {data: res} = await request({
            url: '/getContent',
            method: 'post',
            data: { b_id: this.b_id }
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          this.contentInfo = res.result
          // 给标题，文章内容赋初始值
          this.title = res.result.b_title
          this.content = res.result.b_content_md
        }
      },
      // 修改文章
      async modifyContent () {
        if (this.content !== '') {
          if (this.content !== this.contentInfo.b_content_md || this.title !== this.contentInfo.b_title) {
            if (this.htmlIng === this.htmlEnd) {
              const {data: res} = await request({
                url: '/modifyContent',
                method: 'post',
                data: {
                  "b_id": this.contentInfo.b_id,
                  "b_title": this.title,
                  "b_content_md": this.content,
                  "b_content_html": this.htmlEnd
                }
              })
              if (res.status !== 200) return this.$message.error('出错啦')
              this.$message({
                type: 'success',
                message: '修改成功',
                duration: 1000
              })
              this.$router.replace(`/profile/${this.getUserId}`)
            } else {
              this.$message.warning('壮士别忘记 ctrl + s 保存哦')
            }
          } else {
            this.$message.warning('系统检测到你的文章没有进行修改，不给予提交')
          }
        } else {
          this.$message.error('敢问壮士写的是无字天书吗？')
        }
      },
      // 获取sessionStorage里面的内容
      getUserInfoFormSession () {
        if (getSessionStorage()) {
          this.$store.commit('setUserInfo', getSessionStorage())
        }
      }
    },
    created () {
      this.getContentById()
      this.getUserInfoFormSession()
    }
  }
</script>
<style scoped>
  .edit {
    height: 100%;
    width: 100%;
    position: relative;
  }
  .editTop {
    display: flex;
  }
  .iFont {
    font-size: 40px;
    cursor: pointer;
    margin-top: 6px;
  }
  .el-input {
    width: 77%;
    margin-top: .5%;
    font-size: 20px;
  }
  .el-button {
    height: 45px;
    margin-top: .4%;
    margin-left: .6%;
  }
  .avatar img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-left: 32%;
    margin-top: 32%;
  }

  /*编辑区*/
  @media screen and (max-device-width:1440px) {
    .editArea {
      width: 94%;
      height: 570px;
      margin-left: 50%;
      transform: translate(-50%, 0);
      position: relative;
      z-index: 1;
      margin-top: .5%;
    }
  }
  @media screen and (min-device-width:1600px) {
    .editArea {
      width: 94%;
      height: 570px;
      margin-left: 50%;
      transform: translate(-50%, 0);
      position: relative;
      z-index: 1;
      margin-top: .5%;
    }
  }
  .mavonEdit {
    height: 100%;
    width: 100%;
  }

  /*蒙版*/
  .EditTip {
    height: 655px;
    background-color: #999999;
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    right: 0;
    opacity: .6;
  }
  .tipTop {
    display: flex;
    justify-content: space-between;
  }
  .tipTitle {
    width: 200px;
    height: 50px;
    background-color: #fff;
    margin-left: 2.8%;
    margin-top: .2%;
  }
  .tipSend {
    width: 100px;
    height: 50px;
    background-color: #fff;
    margin-right: 4.5%;
    margin-top: .2%;
  }

  .tipTextAll {
    font-size: 24px;
    color: #fff;
    font-weight: 700;
    letter-spacing: 2px;
  }

  .tipText {
    display: flex;
    justify-content: space-between;
    margin-top: 1%;
  }
  .tipTitleText {
    margin-left: 10%;
    margin-top: 2%;
  }
  .tipSendText {
    margin-right: 2%;
    margin-top: 2%;
  }
  .tipBottom {
    display: flex;
    justify-content: center;
    margin-top: 12%;
  }
  .tipWrite {
    margin-right: 2%;
  }

  .iDiv {
    display: flex;
    justify-content: space-between;
  }
  .iSize {
    font-size: 120px;
    font-weight: 400;
  }
  .leftArrow {
    transform: rotate(275deg);
  }
  .iKnow {
    width: 40%;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    text-align: center;
    background-color: #000;
    cursor: pointer;
    border-radius: 10px;
    border: 1px solid #fff;
  }
  .tipTransition {
    width: 400px;
  }
  .tipPreview {
    margin-left: 2%;
  }
</style>
