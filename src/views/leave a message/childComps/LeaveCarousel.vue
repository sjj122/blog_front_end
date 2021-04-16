<template>
  <div class="carousel">
    <el-carousel :interval="4000" type="card" height="170px" trigger="click">
      <el-carousel-item v-for="item in carouselList" :key="item.c_id" class="carouselItem">
        <leave-carousel-item :item="item"></leave-carousel-item>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
  import {request} from '../../../network/request'
  import LeaveCarouselItem from './LeaveCarouselItem'
  export default {
    name: 'LeaveCarousel',
    data () {
      return {
        carouselList: []
      }
    },
    components: {
      LeaveCarouselItem
    },
    methods: {
      async getCarouselList () {
        const {data: res} = await request('/getCarousel')
        if (res.status !== 200) return this.$message.error('出错啦')
        this.carouselList = res.result

      }
    },
    created () {
      this.getCarouselList()
    }
  }
</script>
<style scoped>
  .el-carousel {
    margin-top: 29px;
    min-width: 901px;
  }
  .carouselItem {
    background-color: #EB8E55;
    color: white;
  }
</style>
