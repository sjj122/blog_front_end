<template>
  <div :class="{'reply-list': true, 'reply-list-bor': reply.length !== 0}">
    <div v-for="item in reply" :key="item.reply_id">
      <div class="nickname">{{item.nickname}} 回复 {{beReplyNN}}</div>
      <div class="content">{{item.content}}</div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'DynamicComCom',
    props: {
      reply: {
        type: Array,
        default () {
          return []
        }
      },
      beReplyNN: {
        type: String,
        default () {
          return ''
        }
      }
    },
    computed: {
      ...mapGetters(['getNickName'])
    }
  }
</script>
<style scoped>
  .reply-list {
    margin-left: 5%;
    width: 95%;
  }
  .reply-list-bor {
    border-top: 1px solid #eee;
  }
  .nickname {
    font-size: 12px;
    font-weight: 600;
  }
  .content {
    margin-left: 5%;
  }
</style>
