<template>
  <div class="list">
    <el-timeline>
      <el-timeline-item v-for="(item, index) in list" :key="item.blog_id"
      :timestamp="showTime(item.blog_createTime)" placement="top" size="large"
      :hide-timestamp="hideTimestamp"  color="#add8e6">
        <dynamic-list-item :item="item"></dynamic-list-item>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
  import {dateFormatBefore} from '../../../common/utils/dateFormat'

  import DynamicListItem from './DynamicListItem'
  export default {
    name: 'DynamicList',
    data () {
      return {
        hideTimestamp: true
      }
    },
    components: {
      DynamicListItem
    },
    props: {
      list: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      // 显示时间
      showTime (value) {
        return dateFormatBefore(value)
      }
    }
  }
</script>
<style scoped>

</style>
