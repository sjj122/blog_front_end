<template>
  <el-card>
    <div class="tip">
      <slot name="tip"></slot>
      <slot name="search"></slot>
    </div>

    <slot name="main"></slot>
  </el-card>
</template>
<script>
  export default {
    name: 'ProfileCard'
  }
</script>
<style scoped>
  .el-card {
    width: 80%;
    height: 600px;
    margin-left: 3%;
    margin-top: 6px;
  }
  .tip {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #3D3D3D;
    font-weight: 600;
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
  }
</style>
