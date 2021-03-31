<template>
    <el-container class="home_container">
      <!--  头部区域 -->
      <el-header>
        <div class="logo_container">
          <img src="../assets/favicon.png" class="img_logo">
          <span class="home_title">广告管理系统</span>
        </div>
        <el-button type="primary" @click="logout" plain>退出</el-button>
      </el-header>
      <!-- 页面的主体区域 -->
      <el-container>
        <!-- Aside 侧边栏区域 -->
        <el-aside :width="isCollapse ? '64px' : '200px' ">
          <div class="toggle_button" @click="toggleColapse">|||</div>
          <!-- 1: 侧边栏菜单区域 -->
          <el-menu :uniqueOpened="false"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true">
              <!-- 一级菜单 -->
                <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                  <!-- 一级菜单的模版区域 -->
                  <template #title>
                    <!-- 一级菜单图标 icon -->
                    <i :class="iconObj[item.id]"></i>
                    <!-- 二级文本框 -->
                    <span>{{ item.authName }}</span>
                  </template>

                  <!-- 二级菜单 -->
                <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
                  <!--  二级菜单图标 -->
                  <template #title>
                    <!-- 一级菜单图标 icon -->
                    <i class="el-icon-menu"></i>
                    <!--  二级文本框 -->
                    <span>{{ subItem.authName }}</span>
                  </template>
                </el-menu-item>
                </el-submenu>
              </el-menu>
        </el-aside>
        <!-- Main 右侧主体区域 -->
        <el-main>
          <!-- 路由的占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  // 私有数据
  data () {
    return {
      //  左侧菜单数据
      menulist: [],
      iconObj: {
        '125': 'el-icon-s-custom',
        '103': 'el-icon-s-check',
        '101': 'el-icon-s-shop',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
      },
      // 是否水平折叠收起菜单 默认为 false
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      // 清空 token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
     const { data: res } = await this.$http.get('menus')
     if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
     this.menulist = res.data
     console.log(res)
    },
    //  点击按钮,切换菜单的折叠与展开
    toggleColapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style>
/* 容器布局 */
.home_container {
  height: 100%;
}
.img_logo {
  height: 42px;
  width: 42px;
  background-color: #545c64;
}
/* 容器侧边栏区域 */
.el-aside {
  background-color: #545c64;
}
/* 解决的侧边栏边框线对不齐的效果属性 */
.el-menu {
  border-radius: none;
}
/* 容器头部区域 */
.el-header {
  background-color: #545c64;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font: small-caps bold 24px/1 sans-serif;
  font-size: 20px;
}
.logo_container {
  display: flex;
  align-items: center;
}
.home_title {
  margin-left: 10px;
}
/* 右侧边框栏 */
.el-main {
  background-color: #EAEDF1;
}
/*  折叠条 */
.toggle_button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
