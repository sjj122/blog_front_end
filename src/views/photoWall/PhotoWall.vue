<template>
  <div>
    <el-card class="wall">
      <!-- 内容显示区域 -->
      <el-card  shadow="hover"
                :class="isChoose === index ? 'container container_border' : 'container'"
                v-for="(item, index) in result"
                :key="index">
        <div slot="header" class="header">
          <el-tooltip content="选择我查看当前相册集" placement="left-start">
            <span class="title" @click="choosePhotos(index, item.title)">《{{ item.title }}》</span>
          </el-tooltip>
          <el-tooltip placement="right-end">
            <div v-if="item.user.user_id !== getUserId" class="content" slot="content">
              <el-button class="likeBtn"
                         size="mini" :type="saveLikedUser(item.user.user_id) ? 'info' : 'danger'"
                         @click="addLike(item.user.user_id, saveLikedUser(item.user.user_id))">
                {{ saveLikedUser(item.user.user_id) ? '已关注' : '+ 关注' }}
              </el-button>
              <section class="sec" v-if="saveLooked.includes(item.user.user_id)">
                <el-image class="avatar" :src="lookedUser[item.user.user_id].avatar"></el-image>
                <div>
                  <span class="nickname">{{ lookedUser[item.user.user_id].nickname }}</span>
                  <span class="sign_content">{{ lookedUser[item.user.user_id].sign_content }}</span>
                  <span class="blogs">原创文章：{{ lookedUser[item.user.user_id].contents.length }} 篇</span>
                </div>
              </section>
              <section v-else>数据正在获取中...</section>
            </div>
            <div v-else slot="content">这是你自己</div>
            <span class="user" @mouseenter="showTooltip(item.user.user_id)">上传者：
                <span class="color">{{ item.user.nickname }}</span>
            </span>
          </el-tooltip>
        </div>
        <div class="background-container" :style="{ 'background-image': `url(${item.background})` }">
          <div class="background" v-for="(item, index) in item.data" :key="index">
            <el-image :src="item" fit="contain" @click.stop="showImage(index)"></el-image>
          </div>
        </div>
        <div class="time">最后更新于：{{ last_modify_time(item.last_modify_time) }}</div>
      </el-card>
      <!-- loadmore -->
      <photo-wall-load-more @loadMore="loadMore" :isLoadMore="isLoadMore"></photo-wall-load-more>
    </el-card>

    <!-- 1.预览图片 -->
    <photo-wall-preview
      :imagesList="imagesList"
      :isShowImage="isShowImage"
      :currentImg="currentImg"
      :currentImgIndex="currentImgIndex"
      @closeShowImage="closeImage"
      @currentIndexChange="changeImageIndex"
      @giveImg="giveImg"
    ></photo-wall-preview>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {getSessionStorage} from '../../common/utils/getSessionStorage'

  import {request} from '../../network/request'
  import {dateFormat} from '../../common/utils/dateFormat'

  import PhotoWallPreview from './childComps/PhotoWallPreview'
  import PhotoWallLoadMore from './childComps/PhotoWallLoadMore'

  export default {
    name: 'PhotoWall',
    data () {
      return {
        // 1.存储在当前页面的数据
        result: [],
        imagesList: [],

        // 2.预览图片所需控制边变量
        isShowImage: false,
        currentImg: '',
        currentImgIndex: -1,

        // 3.当前页数
        page: 1,
        isLoadMore: true,  // 是否还有数据，false-没有数据了

        // 4.是否被选中
        isChoose: -1,

        // 5.保存查看过的用户信息 --- 使用字典形式存储
        saveLooked: [], // 保存获取到数据的user_id，方便进行数据展示
        lookedUser: {},

        // 6.保存关注用户的id
        saveLikedUserArr: []
      }
    },
    methods: {
      // 获取照片数据
      async getImagesList () {
        const {data: res} = await request({
          url: '/getImagesWall',
          method: 'post',
          data: { page: this.page }
        })
        if (res.status !== 200) return this.$message.error('出错啦')
        if (res.result.length === 0) {
          this.isLoadMore = false    // 没有数据了
        } else {
          // 将整体的数据赋值
          this.result.push(...res.result)
        }
      },
      // 加载更多
      loadMore(callback) {
        if (this.isLoadMore) {
          this.page++
          this.getImagesList()
          setTimeout(() => callback(), 300)
        }
        // 隐藏照片集动态箭头
        if (this.getPhotoArrow) this.$store.commit('changePhotoArrow')
      },
      // 选择需要查看的照片集
      choosePhotos(index, title) {
        if (this.imagesList.length === 0) {
          this.isChoose = index
          this.$message.success(`已选择 ${title} 相片集`)
        }
        else if (this.isChoose !== index) {
          this.isChoose = index
          this.$message.success(`已切换到 ${title} 相片集`)
        }
        // 将图片预览数组赋值
        this.imagesList = this.result[index].data
      },
      // 打开蒙版
      showImage (index) {
        if (this.imagesList.length === 0) this.$message.warning('请先点击选择需要查看的相片集')
        else {
          this.isShowImage = true
          this.currentImgIndex = index
          this.giveImg()
        }
      },
      // 子组件请求关闭蒙版
      closeImage() {
        this.isShowImage = false
      },
      // 子组件请求改变image下标
      changeImageIndex(params) {
        if (params === 'sub') {
          this.currentImgIndex--
        } else if(params === 'add') {
          this.currentImgIndex++
        }
      },
      // 赋值图片
      giveImg () {
          this.currentImg = this.imagesList[this.currentImgIndex]
      },
      // 获取sessionStorage里面的内容
      getUserInfoFormSession () {
        if (getSessionStorage()) {
          this.$store.commit('setUserInfo', getSessionStorage())
        }
      },
      // 给 saveLikedUser 已关注的用户id数组赋值
      setSaveLikedUser(val) {
        this.saveLikedUserArr = val
      },
      // 鼠标移动到用户名上时获取上传的用户信息 --- 若当前登录，判断是否已经被关注
      async showTooltip(user_id) {
        if (!this.lookedUser[user_id]) {
          const { data: res } = await request({
            url: '/getUserById',
            method: 'post',
            data: { user_id }
          })
          if (res.status !== 200) return this.$message.error('用户信息获取失败')
          this.lookedUser[user_id] = res.result
          this.saveLooked.push(user_id)
        }
      },
      // 在 tooltip 中加关注 或者 取消关注
      async addLike(belike_user_id, isLike) {
        if (!this.getUserId) return this.$message.warning('壮士还未登录岂能关注？')
        const { data: res } = await request({
          url: '/addLike',
          method: 'post',
          data: {
            belike_user_id,
            user_id: this.getUserId
          }
        })
        if (res.status !== 200) return this.$message.error('操作失败，请稍后再试')
        if (!isLike) this.$message.success('关注成功')
        else this.$message.info('取关成功')
        // 重新拉取用户数据 --- 更新 myLike 数组
        const { data: user } = await request({
          url: '/getUserById',
          method: 'post',
          data: { user_id: this.getUserId }
        })
        if (user.status !== 200) return this.$message.error('网络错误')
        // 重新赋值
        this.$store.commit('setUserMyLike', { myLike: user.result.myLike })
        window.localStorage.setItem('myLike', user.result.myLike)
        this.setSaveLikedUser(user.result.myLike)
      }
    },
    computed: {
      ...mapGetters(['getPhotoArrow', 'getUserId', 'getMyLike']),
      last_modify_time() {
        return val => dateFormat(new Date(val), 'yyyy-MM-dd hh:mm')
      },
      saveLikedUser() {
        return id => this.saveLikedUserArr.includes(id)
      }
    },
    created () {
      this.getUserInfoFormSession()
      this.getImagesList()
      this.setSaveLikedUser(this.getMyLike.split(','))
    },
    beforeDestroy() {
      // 页面卸载之前重置 动态箭头 的显示隐藏值
      if (!this.getPhotoArrow) this.$store.commit('changePhotoArrow')
    },
    components: {
      PhotoWallPreview,
      PhotoWallLoadMore
    }
  }
</script>
<style scoped>
  .wall {
    height: 600px;
    width: 100%;
    overflow: auto;
    background-image: linear-gradient(to right bottom, #a8edea 0%, #fed6e3 100%);
  }
  .wall::-webkit-scrollbar {
    width: 5px;
  }
  .wall::-webkit-scrollbar-thumb, .wall::-webkit-scrollbar-track {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0,0,0,.2);
    background-color: rgba(0,0,0,.1);
  }

  /* 相册集的每一行容器 */
  .container {
    height: 250px;
    width: 100%;
    margin-bottom: 16px;
  }
  .container_border {
    border: 2px dashed #fd79a8;
  }
  /* 相册集容器 */
  .background-container {
    margin-top: -10px;
    margin-bottom: 10px;
    /* background-image: url('http://127.0.0.1:3000/uploads/default_back.jpg'); */
    background-position: center center;
  }
  .background {
    display: inline-block;
    width: 50px;
    height: 140px;
    transition: .5s;
  }
  .time {
    font-size: 12px;
    display: flex;
    justify-content: flex-end;
  }

  /* 鼠标移上去的效果 */
  .background:hover, .background:hover .el-image {
    width: 160px;
  }
  .el-image {
    width: 50px;
    height: 140px;
    border-radius: 10%;
    cursor: pointer;
    transition: .5s;
  }

  /* 卡片头部 */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    font-size: 22px;
    color: #add8e6;
    cursor: pointer;
  }
  .user {
    font-size: 14px;
    cursor: pointer;
  }
  .color {
    color: gold;
  }

  /* tooltip 显示用户信息 */
  .content {
    width: 230px;
    height: 130px;
    position: relative;
  }
  .sec, .sec > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .sec > div > span {
    margin-top: 10px;
    font-size: 13px;
  }
  .likeBtn {position: absolute;}
   
</style>
