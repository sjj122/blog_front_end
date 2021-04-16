<template>
    <div>
        <!--预览图片-->
        <div class="showImg" v-if="isShow" @click="closeImageShow">
            <!--关闭按钮-->
            <i class="el-icon-circle-close currency close"></i>
            <!--前面一张后面一张-->
            <i class="el-icon-arrow-left currency arrowLeft" @click.stop="prev"></i>
            <i class="el-icon-arrow-right currency arrowRight" @click.stop="next"></i>
        </div>
        <div class="imgItem" v-if="isShow">
            <el-image fit="contain" :src="currentImg"></el-image>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'PhotoWallPreview',
        props: {
            imagesList: {
                type: Array
            },
            isShowImage: {
                type: Boolean
            },
            currentImg: {
                type: String
            },
            currentImgIndex: {
                type: Number
            }
        },
        data() {
            return {
                
            }
        },
        computed: {
            // 将 props 经过 computed 包装，消耗的性能更少，更推荐
            isShow() {
                return this.isShowImage
            }
        },
        methods: {
            // 关闭蒙版 --- 向父级请求关闭蒙版，子组件不作操作
            closeImageShow () {
                this.$emit('closeShowImage')
            },
            // 前一张
            prev () {
                if (this.currentImgIndex > 0) {
                    this.$emit('currentIndexChange', 'sub')
                    this.giveImg()
                } else {
                    this.$message.info('已是第一张了')
                }
            },
            // 后一张
            next () {
                if (this.currentImgIndex < this.imagesList.length - 1) {
                    this.$emit('currentIndexChange', 'add')
                    this.giveImg()
                } else {
                    this.$message.info('最后一张啦')
                }
            },
            // 赋值图片
            giveImg () {
                this.$emit('giveImg')
            },
        }
    }
</script>
<style scoped>
    /*蒙版*/
  .showImg {
    width: 1366px;
    height: 100%;
    background-color: black;
    opacity: .4;
    position: absolute;
    z-index: 20;
    top: 0;
    left: 0;
  }
  .currency {
    color: red;
    position: absolute;
    font-size: 42px;
    cursor: pointer;
  }
  .close {
    right: 6%;
    top: 10%;
  }
  .arrowLeft {
    left: 10%;
    top: 40%;
  }
  .arrowRight {
    right: 10%;
    top: 40%;
  }
  /*照片盒子*/
  .imgItem {
    position: absolute;
    z-index: 20;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .imgItem img {
    width: 620px;
    height: 600px;
  }
</style>