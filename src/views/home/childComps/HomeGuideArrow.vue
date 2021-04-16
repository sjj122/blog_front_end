<template>
    <div class="arrow-container">
        <i class="iconfont icon-chang-jian-tou i-font"></i>
        <span class="small-font">点击昵称进入个人空间</span>
    </div>
</template>
<script>
    export default {
        name: "HomeGuideArrow"
    }
</script>
<style scoped>
    .arrow-container {
        position: relative;
        height: 50px;
        width: 190px;
    }
    .i-font {
        position: absolute;
        left: 32%;
        display: inline-block;
        font-size: 26px;
        color: #888;
        transform: rotate(-36deg);
    }
    .small-font {
        position: absolute;
        top: 50%;
        left: 34%;
        font-size: 12px;
        color: #666;
    }
</style>