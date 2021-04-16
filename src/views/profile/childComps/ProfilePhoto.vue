<template>
    <profile-card>
        <div slot="tip" class="tip">我的照片 
            <div v-if="Object.keys(photos) && photos.title !== undefined" class="title-container">
                <span>
                    <span style="font-size: 18px;">《{{ photos.title }}》</span>
                    <span class="last_time">-- 最后更新于：{{ returnDate(photos.last_modify_time) }}</span>
                </span>
                <el-button type="primary" size="small" @click="dialogVisible = true">预览相册集样式</el-button>
            </div>
            <span v-else class="createPhoto"><el-button type="primary" size="mini" @click="createPhoto">创建一个相片集</el-button></span>
        </div>
        <div slot="main">
            <!-- 1.照片合集 -->
            <div v-if="Object.keys(photos) && photos.title !== undefined" id="photos_container" class="photos_container">
                <!-- 2.上传区域 -->
                <div class="photos_upload">
                    <el-upload :action="`${returnBaseUrl}/upPhotoImg`"
                               name="photo"
                               :data="uploadPhotoData"
                               class="uploader"
                               :on-success="uploadSuccess">
                        <i class="el-icon-plus uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="photos-item" v-for="(item, index) in current_show_photos" :key="index">
                    <el-image
                        :id="item"
                        class="photos-item-img"
                        fit="contain"
                        :src="item"
                        :preview-src-list="photos.data"
                        @dragstart="drag"
                        draggable>
                    </el-image>
                </div>
                <!-- 3.loadmore -->
                <photo-wall-load-more :hideText="0" :isLoadMore="isLoadMore" @loadMore="loadMore"></photo-wall-load-more>
                <!-- 4.垃圾桶 -->
                <el-tooltip placement="top" content="将图片拖到这儿来进行删除">
                    <div id="garbage" class="garbage"><i id="i" class="iconfont icon-lajitong garbageI" @dragover="allowDrag"  @drop="drop"></i></div>
                </el-tooltip>
            </div>
            <!-- 5.暂无照片 -->
            <div v-else>暂无照片</div>
            <!-- 6.dialog 弹框 -->
            <profile-photo-preview-dialog :photos="photos" :dialogVisible="dialogVisible" @closeDialog="dialogVisible = false"></profile-photo-preview-dialog>
        </div>
    </profile-card>
</template>
<script>
    import ProfileCard from './ProfileCard'
    import PhotoWallLoadMore from '@/views/photoWall/childComps/PhotoWallLoadMore.vue'
    import ProfilePhotoPreviewDialog from '@/views/profile/childComps/ProfilePhotoPreviewDialog'
    import {mapGetters} from 'vuex'
    import { request } from '@/network/request'
    import { dateFormat } from '@/common/utils/dateFormat'
    import { baseUrl } from '@/common/utils/BaseUrl'
    export default {
        name: 'ProfilePhoto',
        components: {
            ProfileCard,
            PhotoWallLoadMore,
            ProfilePhotoPreviewDialog
        },
        props: {
            userInfo: {
                type: Object,
                default: () => null
            }
        },
        data() {
            return {
                photos: {},     // 需要渲染相片集
                current_show_photos: [],// 当前渲染上去的相片集

                isPhotoExit: true,  // 相片集是否存在

                uploadPhotoData: {  // 上传图片的参数，当前用户的id
                    "user_id": ''
                },

                page: 1,            // 当前页码
                isLoadMore: true,   // 加载更多

                dialogVisible: false,   // 预览相册集样式是否显示
            }
        },
        methods: {
            // 1.找出当前用户的相片集，若没有就提示可以创建一个（一人最多一个）
            async getCurrentUserPhotos() {
                const userid = this.getUserId
                if (!userid) return this.$message.error('请先登录')
                const { data: res } = await request(`/getImagesByUserId?userid=${userid}`)
                if (res.status === 500) this.$message.error('网络错误，获取照片失败')
                else if (res.status === 404) this.isPhotoExit = false
                else {
                    this.photos = res.result
                    this.current_show_photos = this.photos.data.slice(0, 5)
                }
            },
            // 2.上传成功的回调
            uploadSuccess(res) {
                console.log(res)
                if (res.status !== 200) return this.$message.error('上传失败，请稍后再试')
                this.$message.success('上传成功')
                this.photos = res.result.photo
                this.current_show_photos.unshift(res.result.imgUrl)
            },
            // 3.删除相片
            async removePhoto(url) {
                if (!this.getUserId) return this.$message.error('未登录')
                const { data: res } = await request(`/removePhoto?url=${url}&user_id=${this.getUserId}`)
                if (res.status !== 200) return this.$message.error('删除失败')
                this.$message.success('删除成功')
                this.photos = res.result
                this.current_show_photos = this.current_show_photos.filter(item => item !== url)
            },
            // 4.加载更多相片
            loadMore(callback) {
                if (this.current_show_photos.length === this.photos.data.length) {
                    this.$message.info('没有更多数据了')
                    this.isLoadMore = false
                }
                else {
                    this.page++
                    this.current_show_photos.push(...this.photos.data.slice((this.page - 1) * 5, this.page * 5))
                }
                callback()
            },
            // 5.创建一个相片集
            createPhoto() {
                this.$prompt('请输入相片集标题', '新相片集 -- 创建一个相片集', {
                    confirmButtonText: '确认创建',
                    cancelButtonText: '取消创建',
                    inputValidator: val => {
                        if (val === '') return '相片集标题不能为空'
                        else return true
                    }
                }).then(({ value }) => {
                    if (value.trim() === '') return this.$message.error('敢问壮士写的是无字天书吗？')
                    this.$confirm(`确定使用<span style="color: red;">${value}</span>作为你的相册集标题吗？`, '确认？', {
                        confirmButtonText: '确认',
                        cancelButtonText: '我再想想',
                        dangerouslyUseHTMLString: true,
                        type: 'success'
                    }).then(async action => {
                        if (action === 'confirm') {
                            const { data: res } = await request({
                                url: '/createPhotos',
                                method: 'post',
                                data: {
                                    user_id: this.getUserId,
                                    nickname: this.getNickName,
                                    title: value
                                }
                            })
                            if (res.status !== 200) return this.$message.error('创建失败')
                            this.getCurrentUserPhotos()
                            this.$message.success('创建成功')
                        }
                    }).catch(_ => console.log('取消了'))
                }).catch(_ => console.log('关闭了'))
            },
            // 6.拖拽照片到垃圾桶中删除
            allowDrag(e) {
                e.preventDefault()
            },
            drag(e) { // 保存正在被拖动的元素
                e.dataTransfer.setData('Text', e.target.id)
                document.getElementById('i').classList.add('garbageBigger')
                document.getElementById('garbage').classList.add('garbageAni')
            },
            drop(e) { // 放下正在拖动的元素并获值
                e.preventDefault()
                document.getElementById('i').classList.remove('garbageBigger')
                document.getElementById('garbage').classList.remove('garbageAni')
                const url = e.dataTransfer.getData('Text')
                // 执行删除
                this.$confirm('是否要删除该图片', '删除？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async action => {
                    if (action === 'confirm') this.removePhoto(url)
                }).catch(_ => console.log('关闭了'))
            },
            // 7.监听鼠标放下
            listenMouseDown() {
                document.addEventListener('click', e => {
                    document.getElementById('i').classList.remove('garbageBigger')
                    document.getElementById('garbage').classList.remove('garbageAni')
                })
            }
        },
        created() {
            // this.listenMouseDown()
            this.getCurrentUserPhotos()
            this.uploadPhotoData.user_id = this.getUserId
        },
        computed: {
            ...mapGetters(['getUserId', 'getNickName']),
            returnDate() {
                return val => dateFormat(new Date(val), 'yyyy-MM-dd hh:mm:ss')
            },
            returnBaseUrl() {
                return baseUrl
            }
        }
    }
</script>
<style scoped>
    .main {
        display: flex;
        flex-direction: column;
    }
    .tip {
        display: flex;
        align-items: center;
        width: 100%;
    }
    .title-container {
        width: 840px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .last_time {
        font-size: 14px;
        color: #888;
        font-weight: 400;
    }
    .createPhoto {
        margin-left: 10%;
    }

    /* 照片合集区域 */
    .photos_container {
        width: 98%;
        height: 460px;
        border: 1px dotted #eee;
        margin: 10px auto 10px;
        padding: 10px;
        position: relative;

        display: grid;
        grid-template-columns: repeat(3, 1fr);

        overflow: auto;
    }
    .photos_container::-webkit-scrollbar {
        width: 5px;
    }
    .photos_container::-webkit-scrollbar-thumb,  .photos_container::-webkit-scrollbar-track {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0,0,0,.2);
        background-color: rgba(0,0,0,.2);
    }
    .photos-item {
        height: 230px;
        width: 250px;
        background-color: #eee;
        border: 8px solid #4d3900;
        box-shadow: 1px 1px 5px #4d3900;
        margin-bottom: 20px;
    }
    .photos-item-img {
        width: 100%;
        height: 100%;
    }
    /* 上传区域 */
    .uploader {
        height: 245px;
        width: 265px;
        border: 2px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;

        transition: .2s;
    }
    .uploader:hover {
        border-color: #409EFF;
    }
    .uploader-icon {
        font-size: 28px;
        color: #8c939d;
        height: 245px;
        width: 265px;
        line-height: 245px;
        text-align: center;
    }
    .uploader-img {
        height: 245px;
        width: 265px;
        display: block;
    }

    /* 垃圾桶 */
    .garbage {
        position: fixed;
        bottom: 8%;
        right: 5%;
    }
    .garbageAni {
        animation-name: swing;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    .garbageI {
        color: #888;
        font-size: 30px;
    }
    .garbageI:hover { color: black; }

    .garbageBigger {
        color: black;
        font-size: 48px;
    }
    @keyframes swing {
        0% { transform: rotateZ(-26deg); }
        50% { transform: rotateZ(26deg); }
        100% { transform: rotateZ(-26deg); }
    }
</style>