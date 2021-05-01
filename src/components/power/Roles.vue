<template>
  <div>
    <!-- Breadcrumb 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template #default="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '' , 'vcenter']" v-for="(item1, i1) in scope.row.children"
              :key="item1.id">
              <!--  渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 v-for 循环 嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop' , 'vcenter']" v-for="(item2, i2) in item1.children"
                  :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName}}</el-tag>
                    <i class="el-icon-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id"
                    closable @close="removeRightById(scope.row, item3.id)">
                      {{ item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--            <pre>
              {{ scope.row }}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #default="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
      center>
      <!-- Element  Ui 的  Tree 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys" ref="treeRef"></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 所有角色列表数据
        rolesList: [],
        // 控制分配权限对话框的显示与隐藏
        setRightDialogVisible: false,
        // 所以权限的数据默认为空
        rightslist: [],
        // Tree 树形控件的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        // 默认选中的节点Id 值数组
        defkeys: [],
        // 当前即将分配权限角色 ID 为空
        roleId: ''
      }
    },
    // 定义我们生命周期函数
    created() {
      this.getRolesList()
    },
    methods: {
      // 获取所有角色的列表
      async getRolesList() {
        const {
          data: res
        } = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        this.rolesList = res.data
        console.log(this.rolesList)
      },
      //  根据 Id删除对应的权限
      async removeRightById(role, rightId) {
        // 弹框提示用户是否删除
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('取消了删除!')
        }
        // console.log('确定了删除')
       const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败！')
        }
        // this.getRolesList()
        role.children = res.data
      },
      // 展示分配权限的对话框
      async showSetRightDialog (role) {
        this.roleId = role.id
        // 获取所以权限的数据
        const { data: res } = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限数据失败！')
        }
        // 把获取的权限数据保存到 data 中
        this.rightslist = res.data
        console.log(this.rightslist)

        // 递归获取三级节点的ID
        this.getLeafKeys(role,
        this.defkeys)

        this.setRightDialogVisible = true
      },
      //  通过递归的形式,获取角色下所以三级权限的 ID,并保存到数组中 defKeys
      getLeafKeys(node, arr) {
        //  如果当前node 节点不包含children属性,则是三级节点
        if (!node.children) {
          return arr.push(node.id)
        }

        node.children.forEach(item => this.getLeafKeys(item, arr))
      },
      //  监听分配权限对话框的关闭事件
      setRightDialogClosed () {
         this.defkeys = []
      },
      // 点击为角色分配权限 ...代表展开预算符
      async allotRights () {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        // console.log(keys)
        const idStr = keys.join(',')
        const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }

        this.$message.success('分配权限成功！')
        this.getRolesList()
        this.setRightDialogVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #EEEEEE;
  }

  .bdbottom {
    border-bottom: 1px solid #EEEEEE;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
