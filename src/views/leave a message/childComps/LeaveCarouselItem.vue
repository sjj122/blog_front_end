<template>
  <div class="carousel-item">
    <img v-lazy="item.c_img" class="carousel-img" >
    <div class="text">{{item.c_text}}</div>
  </div>
</template>
<script>
  export default {
    name: 'LeaveCarouselItem',
    props: {
      item: {
        type: Object,
        default () {
          return {}
        }
      }
    }
  }
</script>
<style scoped>
  .carousel-item {
    display: flex;
  }
  .text {
    width: 142px;
    font-size: 14px;
    margin: .6% 1.4%;
  }
  .carousel-img {
    width: 300px;
    height: 150px;
    margin: 2% .2%;
  }
</style>
