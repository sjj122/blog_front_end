<template>
  <div class="replyList">
    <div class="replyList-item" v-for="(item, index) in reply">
      <div class="info">
        <img class="avatar" :src="item.avatar">
        <div class="nickname">{{item.nickname}} <span style="color: #9f9f9f;"> 回复 @{{b_c_nickname}}</span></div>
        <div class="time">{{item.created_time | showDate}}</div>
      </div>
      <div class="content">{{item.content}}</div>
    </div>
  </div>
</template>
<script>
  import {dateFormatBefore} from '../../../common/utils/dateFormat'

  export default {
    name: 'BlogDetailCommentReply',
    props: {
      reply: {
        type: Array,
        default () {
          return []
        }
      },
      b_c_nickname: {
        type: String,
        default () {
          return ''
        }
      }
    },
    filters: {
      showDate (value) {
        return dateFormatBefore(value)
      }
    },
  }
</script>
<style scoped>
  .replyList {
    width: 90%;
    margin-left: 4%;
    margin-bottom: 1%;
  }
  .replyList-item {
    margin-top: 1%;
    padding-top: .2%;
    border-top: 1px solid #eee;
  }
  .info {
    display: flex;
  }
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  .nickname {
    font-size: 14px;
    color: #2E2E2E;
    margin-left: 1%;
  }
  .time {
    font-size: 12px;
    margin-left: 16px;
    margin-top: .2%;
    color: #999999;
  }
  .content {
    font-size: 14px;
    margin-top: .4%;
    margin-left: 2.9%;
  }
</style>
