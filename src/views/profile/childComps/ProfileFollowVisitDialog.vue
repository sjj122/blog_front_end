<template>
    <el-dialog
               :visible.sync="visitDialogVisible"
               width="70%"
               append-to-body
               :before-close="handleClose">
        <div slot="title"><span style="color: red;">{{ currentUser.nickname }}</span> 的关注列表</div>
        <el-table
            :data="tableData"
            style="width: 100%"
            max-height="420"
            @expand-change="expandChange">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <div v-if="currentUserBlogs[scope.row.user_id] !== undefined">
                        <section v-if="currentUserBlogs[scope.row.user_id].length !== 0" class="blogs-container">
                            <article class="blog-item" v-for="(item, index) in currentUserBlogs[scope.row.user_id]" :key="index">
                                <div class="blog_title_item" @click="gotoBlogDetail(item.b_id)">
                                    <el-tooltip placement="top" content="查看文章详情">
                                        <el-card>文章标题：<span class="blog_title_item_text">{{item.b_title}}</span></el-card>
                                    </el-tooltip>
                                </div>
                                <el-tag class="blog_title_other" type="info">
                                    <i class="iconfont icon-zan">{{ item.b_stars.length }}</i>
                                    <i class="iconfont icon-look">{{ item.b_looks.length }}</i>
                                    <i class="el-icon-chat-dot-square">{{ item.b_comments.length }}</i>
                                </el-tag>
                            </article>
                        </section>
                        <section v-else>暂无数据</section>
                    </div>
                    <i v-else class="el-icon-loading" style="font-size: 30px;"></i>
                </template>
            </el-table-column>
            <el-table-column label="头像" width="80">
                <template slot-scope="scope">
                    <el-image class="row-avatar" :src="scope.row.avatar"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称" width="80"></el-table-column>
            <el-table-column prop="sign_content" label="个性签名" width="240"></el-table-column>
            <el-table-column prop="contents" label="原创文章" width="310">
                <template slot-scope="scope">
                    <div v-if="scope.row.contents.length !== 0">
                        <el-tooltip placement="right" content="点击我前面的 > 查看他的博客">
                            <el-tag>{{ scope.row.contents.length }}&nbsp;&nbsp;&nbsp;&nbsp;篇</el-tag>
                        </el-tooltip>
                    </div>
                    <section v-else class="addOil">
                        <el-tag>他暂时还没有原创文章，给他加油吧~</el-tag>
                        <el-button type="danger" size="mini">加油</el-button>
                    </section>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template>
                    <el-button type="primary" size="mini">关注</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script>
    import { request } from '@/network/request'
    export default {
        name: 'ProfileFollowVisitDialog',
        props: {
            visitDialogVisible: {
                type: Boolean,
                default: () => false
            },
            currentUser: {
                type: Object,
                default: () => null
            }
        },
        data() {
            return {
                tableData: [],
                currentUserBlogs: {},   // 当前下拉的用户的 --- dict 字典形式 user_id 为 key
                expandedIndexObj: {},   // 记录当前哪些行被展开了 --- 使用 字典 形式 user_id 作为 key
            }
        },
        methods: {
            // 1.获取用户关注列表
            async getMyLike() {
                const { data: res } = await request({
                    url: '/getFollowList',
                    method: 'post',
                    data: { myLike: this.currentUser.myLike }
                })
                if (res.status !== 200) return this.$message.error('数据获取失败')
                this.tableData = res.result
            },
            // 2.关闭模态框
            handleClose() {
                this.$emit('closeVisitDialog')
            },
            // 3.扩展内容打开
            expandChange(row, expanded) {
                if (this.expandedIndexObj[row.user_id] === undefined) {
                    this.getBlogsContent(row.user_id, row.contents)
                    // 将发过请求的记录在 expandedIndexObj 中
                    expanded.forEach(item => {
                        this.expandedIndexObj[item.user_id] = item
                    })
                }
            },
            // 4.获取博客内容
            async getBlogsContent(user_id, contents) {
                const { data: res } = await request({
                    url: '/getContentsByArray',
                    method: 'post',
                    data: { blogIdArr: contents }
                })
                if (res.status !== 200) return this.$message.error('数据获取失败')
                // 以字典的形式存储
                this.currentUserBlogs[user_id] = res.result.flat(Infinity)
            },
            // 5.去到博客详情页面
            gotoBlogDetail(b_id) {
                this.$router.push(`/blogDetail/${b_id}`)
            }
        },
        created() {
            setTimeout(() => {
                this.getMyLike()
            }, 10)
        }
    }
</script>
<style scoped>
    .row-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .addOil {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .blogs-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
    .blog-item {
        width: 95%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-right: 1px dashed #ccc;
        padding-right: 8px;
    }
    .blog_title_item {
        width: 100%;
        margin-bottom: 5px;
        cursor: pointer;
        font-size: 12px;
    }
    .blog_title_item_text {
        font-size: 15px;
        color: #666;
    }
    .blog_title_other {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 4px;
    }
    .blog_title_other > i {
        font-size: 12px;
        margin-right: 5px;
    }
    .blog_title_other > i:nth-child(1) { color: red; }
    .blog_title_other > i:nth-child(2) {
        font-size: 13px;
        color: black;
    }
    .blog_title_other > i:nth-child(3) { color: orange; }
</style>