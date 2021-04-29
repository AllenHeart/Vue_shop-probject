<template>
  <div id="app">
      <!-- 路由占位符 -->
      <transition>
        <router-view></router-view>
      </transition>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="less" scoped>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
</style>
