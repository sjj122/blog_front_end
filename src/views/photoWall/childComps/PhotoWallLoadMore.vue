<template>
    <div class="loadmore_container">
        <el-button v-if="isLoadMore"
                   type="primary"
                   size="mini"
                   :disabled="isLoading"
                   @click.stop="loadMore">
                   <i :class="isLoading ? 'el-icon-loading' : 'el-icon-plus'"></i> 还有更多吗？
        </el-button>
        <span v-else><span v-if="hideText"> - 你看到我的底线了 - </span></span>
    </div>
</template>
<script>
    export default {
        name: 'PhotoWallLoadMore',
        props: {
            isLoadMore: {
                type: Boolean
            },
            hideText: {
                type: Number,
                default: () => 1
            }
        },
        data() {
            return {
                // 1.图标样式的转换
                isLoading: false,
            }
        },
        methods: {
            // 1.加载更多
            loadMore() {
                this.isLoading = true
                this.$emit('loadMore', () => {
                    this.isLoading = false
                })
            }
        }
    }
</script>
<style scoped>
    .loadmore_container {
        margin-top: -1%;
        text-align: center;
    }
</style>