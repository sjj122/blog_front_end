<template>
    <div class="arrow_container">
        <div class="text">将鼠标移动到标题上试试~</div>
        <div class="icon">
            <i class="iconfont icon-chang-jian-tou"></i>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'HomeLeftArrow'
    }
</script>
<style scoped>
    .arrow_container {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 200px;
        height: 30px;
        top: 5%;
        left: 12%;
    }
    .arrow_container > .text {font-size: 13px;}
    .arrow_container > .icon {
        position: absolute;
        transform: rotate(90deg);
        top: -30%;
        left: 0;
        animation-name: trans;
        animation-duration: 1.5s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
    }
    i {
        font-size: 70px;
        color: #eee;
    }
    @keyframes trans {
        0% { left: 0; }
        50% { left: 40%; }
        100% { left: 0; }
    }
</style>