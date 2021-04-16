<template>
    <div class="loadmore">
        <i v-if="!this.status" class="el-icon-loading loading"></i>
        <span>{{ this.status ? '你看到我的底线了' : '正在加载更多...' }}</span>
    </div>
</template>
<script>
    export default {
        name: 'DynamicLoadMore',
        props: {
            status: {
                type: Boolean
            }
        }
    }
</script>
<style scoped>
    .loadmore {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fd79a8;
    }
    .loading {
        margin-right: 1%;
        font-size: 26px;
    }
</style>