<template>
    <el-dialog v-if="photos"
               title="预览在照片墙中展示给别人的相册集"
               :visible.sync="isShow"
               width="80%"
               append-to-body
               :before-close="handleClose">
        <div class="dialog-container">
            <!-- 1.一些修改按钮 -->
            <section class="modify">
                <!-- 修改相册集标题 -->
                <div class="modifyTitle">
                    <el-input style="width: 240px"
                              ref="modifyInput" 
                              v-model="newTitle"
                              :placeholder="photos.title"
                              maxlength="10"
                              show-word-limit
                              clearable>
                    </el-input>
                </div>
                <!-- 修改相册集背景图 -->
                <div class="modifyBackground">
                    <span>选择修改相册集背景图：</span>
                    <el-radio v-for="(item, index) in options"
                              :key="index"
                              v-model="newBackground"
                              :label="item.url"
                              class="radio">
                        <el-image :src="item.url" class="bgc"></el-image>
                    </el-radio>
                </div>
                <!-- 保存 -->
                <div class="modifySave">
                    <el-button type="danger" size="small" @click="modifySave">保存修改</el-button>
                </div>
            </section>
            <!-- 2.显示主体 -->
            <el-card>
                <!-- 头部 -->
                <div slot="header" class="header">
                    <span class="title">《{{ newTitle === '' ? photos.title : newTitle }}》</span>
                    <span class="user">上传者：
                        <span class="color" v-if="photos.user">{{ photos.user.nickname }}</span>
                    </span>
                </div>
                <!-- 图片区域 -->
                <div class="background-container" :style="{ 'background-image': `url(${newBackground === '' ? photos.background : newBackground})` }">
                    <div class="background" v-for="(item, index) in photos.data" :key="index">
                        <el-image :src="item" fit="contain"></el-image>
                    </div>
                </div>
                <!-- 时间 -->
                <div class="time">最后更新于：{{ last_modify_time(photos.last_modify_time) }}</div>
            </el-card>
        </div>
    </el-dialog>
</template>
<script>
    import { dateFormat } from '@/common/utils/dateFormat'
    import { baseUrl } from '@/common/utils/BaseUrl'
    import { request } from '@/network/request'
    import { mapGetters } from 'vuex'
    export default {
        name: 'ProfilePhotoPreviewDialog',
        props: {
            dialogVisible: {
                type: Boolean,
                default: () => false
            },
            photos: {
                type: Object,
                default: () => null
            }
        },
        data() {
            return {
                isShowModifyTitle: true,    // 切换显示button与input
                newTitle: '',               // 新标题

                
                options: [],                // 背景图片选择
                newBackground: '',          // 新的背景图片
            }
        },
        computed: {
            ...mapGetters(['getUserId']),
            isShow() {
                return this.dialogVisible
            },
            last_modify_time() {
                return val => dateFormat(new Date(val), 'yyyy-MM-dd hh:mm')
            },
            returnBaseUrl() {
                return baseUrl
            }
        },
        methods: {
            // 1.模态框的关闭
            handleClose() {
                // 初始化数据
                this.newTitle = ''
                this.newBackground = ''
                this.$emit('closeDialog')
            },
            // 2.标题与背景同一提交保存
            async modifySave() {
                if (!this.getUserId) return this.$message.error('请登录')
                else if (this.newTitle.trim() === '' && this.newBackground.trim() === '')  return this.$message.info('没做任何修改')
                else if (this.newTitle === this.photos.title && this.newBackground === this.photos.background)  return this.$message.info('没做任何修改')
                const { data: res } = await request({
                    url: '/modifyInfo',
                    method: 'post',
                    data: {
                        user_id: this.getUserId,
                        title: this.newTitle || this.photos.title,
                        background: this.newBackground || this.photos.background
                    }
                })
                if (res.status !== 200) return this.$message.error('修改失败')
                this.$message.success('修改成功')
            }
        },
        beforeMount() {
            this.options = [
                { name: '默认1', url: `${this.returnBaseUrl}/uploads/backgroundImage/default_back1.jpg` },
                { name: '默认2', url: `${this.returnBaseUrl}/uploads/backgroundImage/default_back2.jpg` },
                { name: '默认3', url: `${this.returnBaseUrl}/uploads/backgroundImage/default_back3.jpg` },
            ]
        }
    }
</script>
<style scoped>
    .modify {
        display: flex;
        align-items: center;
        margin-bottom: 2%;
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
    }
    .user {
        font-size: 14px;
    }
    .color {
        color: gold;
    }
    /* 图片显示主体 */
    .background-container {
        margin-top: -10px;
        margin-bottom: 10px;
        /* background-image: url('http://127.0.0.1:3000/uploads/default_back.jpg'); */
        background-position: center center;
    }
    .background {
        display: inline-block;
        width: 50px;
        border-radius: 10%;
        transition: .5s;

        background-image: url('http://127.0.0.1:3000/uploads/default_back.jpg');
        background-position: center center;
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
        transition: .5s;
    }

    .modifyBackground {
        display: flex;
        align-items: center;
        margin-left: 2%;
    }
    .radio {
        display: flex;
        align-items: center;
    }
    .bgc {
        width: 46px;
        height: 46px;
    }
    .modifySave {
        margin-left: 20%;
    }
</style>