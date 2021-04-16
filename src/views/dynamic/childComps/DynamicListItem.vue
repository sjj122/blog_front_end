<template>
  <div>
    <el-card shadow="hover">

      <div class="title">
        <span>{{item.blog_title}}</span>
        <div class="starCon" @click="star">
          <i :class="{'el-icon-star-off': !isStar, 'el-icon-star-on': isStar, 'star': true }"></i>
          <span>{{stars}}</span>
        </div>
      </div>

      <div class="content">{{item.blog_content}}</div>

      <div class="image">
        <div v-for="(image, index) in item.blog_images" :key="index">
          <el-image :src="image" :preview-src-list="srcList" :lazy="lazy">
            <div slot="error">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </div>

      <div class="create-time">{{item.blog_createTime | showDate}}</div>

      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            <i class="el-icon-chat-line-round iconClass"></i>
            <span class="commentCount">{{commentsCount}}</span>
          </template>
          <!--评论内容-->
          <dynamic-comment :comments="item.blog_comments" :blog_id="item.blog_id"
            @commentUpdate="commentUpdate"></dynamic-comment>

        </el-collapse-item>
      </el-collapse>

    </el-card>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {dateFormat} from '../../../common/utils/dateFormat'

  import DynamicComment from './DynamicComment'

  import {request} from '../../../network/request'

  export default {
    name: 'DynamicListItem',
    data () {
      return {
        commentsCount: this.item.blog_comments.length,
        // 图片预览数组
        srcList: [],
        // 图片懒加载
        lazy: true,
        // 是否点了赞
        isStar: false,
        // 点赞人数
        stars: this.item.blog_stars.length,
      }
    },
    created () {
      this.srcList = this.item.blog_images
      // 检查是否点了赞
      this.checkStar()
    },
    props: {
      item: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    components: {
      DynamicComment
    },
    computed: {
      ...mapGetters(['getUserId'])
    },
    methods: {
      // 更新评论的条数
      commentUpdate (newLen) {
        this.commentsCount = newLen
      },
      // 给blog点赞
      async star () {
        if (this.getUserId) {
          let o = {
            blog_id: this.item.blog_id,
            user_id: this.getUserId
          }
          const {data: res} = await request({
            url: '/star',
            method: 'post',
            data: o
          })
          if (res.status !== 200) return this.$message.error('出错啦')
          // 操作成功
          //   刷新点赞的人数
          this.stars = res.result.length
          //   更换图标
          this.isStar = !this.isStar
          if (this.isStar) {
            this.$message({
              showClose: true,
              message: '感谢壮士支持',
              type: 'success',
              duration: 1000
            })
          }
        } else {
          // 没登录
          this.$message.error('壮士，偶还不晓得你滴称号')
        }
      },
      // 检查当前登录的用户是否对该博客点过赞
      checkStar () {
        // 检查当前登录的用户是否对该博客点过赞
        if (this.getUserId !== '') {
          for (let i of this.item.blog_stars) {
            if (i === window.localStorage.getItem('user_id')) {
              // 点过赞
              this.isStar = true
              break
            }
          }
        }
      },
    },
    filters: {
      showDate (value) {
        const date = new Date(value)
        return dateFormat(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>
<style scoped>
  .el-card {
    margin-top: 12px;
    width: 100%;
    min-width: 822px;
  }
  .title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title > span {
    font-size: 22px;
    letter-spacing: 2px;
    text-shadow: 0 0 10px #ccc;
  }
  .starCon {
    cursor: pointer;
  }
  .star {
    font-size: 26px;
    padding-right: 6px;
  }
  .image {
    display: flex;
  }
  .image div .el-image {
    width: 100px;
    height: 100px;
    padding-right: 10px;
  }
  .create-time {
    text-align: right;
  }
  .iconClass {
    font-size: 24px;
  }
  .commentCount {
    font-size: 15px;
    padding-left: 6px;
  }
</style>
