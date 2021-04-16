<template>
    <profile-card>
        <div slot="tip">我的关注</div>
        <div slot="search" class="search">
            <el-input placeholder="查找..." @clear="clearSearchInput" @keydown.enter.native="searchFollow" v-model="searchContent" clearable>
                <el-button slot="append" icon="el-icon-search" @click="searchFollow"></el-button>
            </el-input>
        </div>
        <div slot="main">
            <!-- 1.未进行搜索 --><!-- 2.搜索之后展示的界面 -->
            <div class="no-search">
                <div v-if="showFollowUserList.length !== 0" class="user_content">
                    <el-card class="card-item"
                            :body-style="{ 'display': 'flex', 'padding': '10px', 'align-items': 'center' }"
                            v-for="(item, index) in searchResult.length === 0 ? showFollowUserList : searchResult" :key="index"
                            @click.native="gotoUserInfo(item.user_id)">
                        <el-image
                            :src="item.avatar"
                            style="width: 60px; height: 60px; border-radius: 50%;"
                            class="img inlineBlock"
                        ></el-image>
                        <div class="other">
                            <div class="middle inlineBlock">
                                <p class="nickname">{{ item.nickname }}</p>
                                <p class="sign_content">{{ item.sign_content }}</p>
                            </div>
                            <profile-follow-button @cancel="cancelFollow($event, item.user_id)"></profile-follow-button>
                        </div>
                    </el-card>
                </div>
                <div v-else>暂时还没有关注任何人</div>
                <div class="pagination">
                    <!-- 1.myLike分页条 -->
                    <el-pagination
                                v-if="getMyLike.length !== 0 && searchContent === '' && toUserMyLike.length === 0"
                                layout="prev, pager, next"
                                :total="getMyLike.split(',').length"
                                :page-size="6"
                                hide-on-single-page
                                @current-change="pageChange"
                    ></el-pagination>
                    <!-- 2.searchResult分页条 -->
                    <el-pagination
                                v-if="searchResult.length !== 0"
                                layout="prev, pager, next"
                                :total="searchResult.length"
                                :page-size="6"
                                hide-on-single-page
                    ></el-pagination>
                </div>
            </div>
        </div>
    </profile-card>
</template>
<script>
    import {request} from '../../../network/request'
    import {mapGetters} from 'vuex'
    import ProfileFollowButton from './ProfileFollowButton.vue'
    import ProfileCard from './ProfileCard.vue'
    export default {
        name: 'ProfileFollow',
        components: {
            ProfileCard,
            ProfileFollowButton
        },
        data() {
            return {
                followUserList: [],     // 关注的用户信息
                showFollowUserList: [], // 进行显示的关注的用户信息
                page: 1,                // myLike当前浏览到哪一页
                toUserPage: 1,          // touser myLike当前浏览到哪一页
                searchContent: '',      // 查找的内容
                searchResult: [],       // 查找后的结果
                toUserMyLike: [],       // 查看用户的myLike数组
            }
        },
        props: {
            userInfo: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        computed: {
            ...mapGetters(['getUserId', 'getMyLike'])   // 传过来是一个字符串
        },
        created() {
            // 获取关注的用户信息
            this.getFollowUserInfoList()
        },
        methods: {
            // 获取关注的用户列表
            // 传递myLike，每6个一组传递到后端
            async getFollowUserInfoList() {
                if (this.getMyLike.length !== 0) {
                    const { data: res } = await request({
                        url: '/getFollowList',
                        method: 'post',
                        data: {
                            myLike: this.getMyLike.split(',').slice(6 * (this.page - 1), 6 * this.page)
                        }
                    })
                    if (res.status !== 200) return this.$message.error('网络错误，稍后再试')
                    this.followUserList.push(...res.result)     // 追加而不是替换
                    this.showFollowUserList = this.followUserList.slice(6 * (this.page - 1), 6 * this.page)
                }
            },
            // myLike page++
            pageChange(currentPage) {
                const flag = currentPage > this.page    // 页数增长的时候置为true
                this.page = currentPage
                if (flag && this.followUserList.length < this.getMyLike.split(',').length) {
                    // 1.需要向服务器拉取数据的情况
                    this.getFollowUserInfoList()    // 重新拉取数据
                } else {
                    // 2.不需要继续拉取数据，截取followUserList进行展示
                    this.showFollowUserList = this.followUserList.slice(6 * (this.page - 1), 6 * this.page)
                }
                
            },
            // 取消关注
            async cancelFollow(callback, belike_user_id) { // 拿到要取关的belike_user_id
                const { data: res } = await request({
                    url: '/addLike',
                    method: 'post',
                    data: {
                        user_id: this.getUserId,
                        belike_user_id: belike_user_id
                    }
                })
                if (res.status !== 200) return this.$message.error('网络错误，稍后再试')
                // 1.将最新值保存到sessionStorage中
                window.localStorage.setItem('myLike', res.result.myLike)
                // 2.将最新的值赋值到 store 中
                this.$store.commit('setUserMyLike', { myLike: res.result.myLike })
                // 3.执行回调函数
                callback(res.message)
            },
            // 查找关注者
            async searchFollow() {
                if (this.searchContent.trim() === '') return this.$message.error('输入不能为空')
                const { data: res } = await request({
                    url: '/searchFollow',
                    method: 'post',
                    data: { nickname: this.searchContent, user_id: this.getUserId }
                })
                if (res.status !== 200) return this.$message.error('查询失败，请稍后再试')
                if (res.result.length === 0) return this.$message.error('暂时没有相关壮士...')
                this.searchResult = res.result
            },
            // 清空查找输入框 --- 恢复原来的关注列表显示
            clearSearchInput() {
                this.searchResult = []
            },
            // 去到关注的用户相关信息页
            gotoUserInfo(user_id) {
                this.$router.push(`/profileVisit/${user_id}`)
            }
        }
    }
</script>
<style scoped>
    .user_content {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }
    .card-item {
        margin-top: 1%;
        margin-left: 1%;
        margin-bottom: 2%;
        width: 48%;
        height: 110px;
        cursor: pointer;
    }
    .inlineBlock { display: inline-block; }
    
    .img {
        margin-left: 2.9%;
    }

    .other {
        width: 78%;
        display: flex;
        margin-left: 4%;
        align-items: center;
        justify-content: space-between;
    }

    .other > .middle { margin-top: -2%; }
    .nickname {
        font-size: 16px;
    }
    .sign_content {
        font-size: 12px;
    }

    .right > .el-button {
        width: 76px;
        height: 24px;
        line-height: 0;
        letter-spacing: 2px;
        text-align: center;
        background-color: #eee;
        color: #888;
    }
    .el-button:hover {
        background-color: #eee;
        border-color: #eee;
        color: #add8e6;
    }

    /* 分页 */
    .pagination {
        position: absolute;
        bottom: 11%;
        left: 50%;
    }

    /* 搜索框 */
    .search {
        margin-left: 5%;
        height: 26px;
    }
    .el-input__inner {
        height: 32px !important;
        line-height: 32px !important;
    }
    
</style>
