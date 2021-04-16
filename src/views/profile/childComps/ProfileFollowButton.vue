<template>
    <div class="right inlineBlock">
        <el-button @click.stop="cancelFollow" :class="{ 'addFollow': !isChange }">{{ isChange ? '已关注' : '+ 关注' }}</el-button>
    </div>
</template>
<script>
    export default {
        name: 'ProfileFollowButton',
        data() {
            return {
                isChange: true,    // 按钮文本是否需要改变
            }
        },
        methods: {
            cancelFollow() {
                // 传递一个回调函数，处理取关后的按钮显示
                this.$emit('cancel', msg => {
                    this.isChange = msg     // 取关返回false，关注返回true
                })
            }
        }
    }
</script>
<style scoped>
    .inlineBlock { display: inline-block; }
    .right > .el-button {
        width: 76px;
        height: 24px;
        line-height: 0;
        letter-spacing: 2px;
        text-align: center;
        background-color: #eee;
        color: #888;
        transition: .5s;
    }
    .el-button:hover {
        background-color: #eee;
        border-color: #eee;
        color: #add8e6;
    }
    .addFollow {
        background-color: #fd79a8 !important;
        color: white !important;
        border: 1px solid #fff;
    }
</style>