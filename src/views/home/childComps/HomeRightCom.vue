<template>
  <div class="homeRight" @click="showMessageList">
    <div>查 看 全 部 留 言</div>

    <el-drawer :visible.sync="isMessagesList"
    direction="rtl" appendToBody :withHeader="false"
    size="66%" @open="openDrawer" @close="closeDrawer">
      <el-table :data="messageList">
        <el-table-column label="壮士称号">
          <template slot-scope="scope">
            <img :src="scope.row.m_avatar" class="rowImage">
            <div class="rowText">{{scope.row.m_nickname}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="m_content" label="留言内容" width="490px"></el-table-column>
        <el-table-column label="留言时间">
          <template slot-scope="scope">
            <el-tag>{{scope.row.m_created_time | showDate}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="点赞">
          <template slot-scope="scope">
            <table-zan-item :item="scope.row" :open="open" @opened="opened" @refreshTable="refreshTable" :key="scope.row.m_id"></table-zan-item>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination :page-size="6" layout="prev, pager, next, jumper"
      :total="messageCount" background small @current-change="currentChange">
      </el-pagination>
    </el-drawer>
  </div>
</template>
<script>
  import {request} from '../../../network/request'

  import {dateFormat} from '../../../common/utils/dateFormat'

  import tableZanItem from './homeRightComChild/homeRightComChild'

  export default {
    name: 'HomeRightCom',
    data () {
      return {
        isMessagesList: false,
        messageList: [],

        // 页码
        page: 1,
        // 留言条数
        messageCount: 0,
        // 记录打开了抽屉，判断点赞
        open: false,
      }
    },
    methods: {
      // 展开抽屉
      showMessageList () {
        this.isMessagesList = true
      },
      // 分页请求留言数据
      async getMessage (page) {
        const {data: res} = await request({
          url: '/getAllMessage',
          method: 'post',
          data: {
            page: page,
            pageSize: 6
          }
        })
        if (res.status !== 200) this.$message.error('出错啦')
        let m_arr = res.result.messages, user_n_a_arr = res.result.user_n_a_arr
        for (let i = 0; i < m_arr.length; ++i) {
          m_arr[i].m_nickname = user_n_a_arr[i].nickname,
          m_arr[i].m_avatar = user_n_a_arr[i].avatar
        }
        this.messageList = m_arr
      },
      // 改变当前页
      currentChange (currentPage) {
        this.page = currentPage
        this.getMessage(this.page)
      },
      // 获取全部留言的条数
      async getMessageCount () {
        const {data: res} = await request('getMessageCount')
        if (res.status !== 200) return this.$message.error('出错啦')
        this.messageCount = res.result
      },
      // 点赞完成刷新表格
      refreshTable () {
        this.getMessage(this.page)
      },
      // 打开抽屉，再请求一次数据
      openDrawer () {
        this.open = true
        this.getMessage(this.page)
      },
      // 关闭抽屉，告诉外面的页面，刷新页面
      closeDrawer () {
        this.$emit('closeDrawer')
      },
      // 抽屉已打开，将open置为false，方便下次判断
      opened () {
        this.open = false
      }
    },
    created () {
      this.getMessage(1)  // 先请求第一页
      this.getMessageCount()
    },
    filters: {
      showDate (value) {
        return dateFormat(new Date(value), 'MM-dd hh:mm')
      }
    },
    components: {
      tableZanItem
    }
  }
</script>
<style scoped>
  .homeRight {
    position: fixed;
    height: calc(100% - 65px);
    width: 36px;
    background-color: black;
    color: white;
    right: 0;
    text-align: center;

    transition: all .6s ease;
    cursor: pointer;
    z-index: 99;
  }
  .homeRight div {
    position: absolute;
    width: 28px;
    height: 129px;
    top: 50%;
    margin-left: 50%;
    transform: translate(-50%, -50%);
  }
  .homeRight:hover {
    width: 100px;
  }
  .rowImage {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-left: 18%;
  }
  .rowText {
    font-size: 12px;
    margin-top: -9px;
    text-align: center;
    width: 80px;
  }
  .el-pagination {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translate(-50%, 0);
  }
</style>
