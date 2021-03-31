<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容">
              <template #append>
                <el-button icon="el-icon-search"></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
              <el-button type="primary" >添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 用户列表区域 -->
         <el-table :data="userlist" border stripe>
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="用户编号" type="index" width="80" align="center"></el-table-column>
            <el-table-column label="标题/姓名" prop="username"align="center"></el-table-column>
            <el-table-column label="行业/邮箱" prop="email" align="center"></el-table-column>
            <el-table-column label="电话" prop="mobile" align="center"></el-table-column>
            <el-table-column label="角色" prop="role_name" align="center"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createtime" width="180">
                <template slot-scope="scope">
                  <span></span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="100%">
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.status"
                          active-value="0"
                          active-color="#13ce66"
                          inactive-value="1"
                          inactive-color="#ff4949">
                         </el-switch>
                      </template>
            </el-table-column>
            <el-table-column label="操作"></el-table-column>
         </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  // 定义我们该组件中存放哪些私有数据
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist :[],
      total: 0,
      isIndeterminate: false
    }
  },
  // 定义我们生命周期函数
    created () {
      this.getUserList()
    },
  // 定义当前组件中的处理事件函数
    methods: {
     async getUserList() {
        const { data: res }= await this.$http.get('users', { params: this.queryInfo })
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败!')
        }
        //  这里是给 userlist total 数据赋值
        this.userlist = res.data.users
        this.total = res.data.total
        console.log(res)
      }
    }
  }
</script>

<style>
</style>
