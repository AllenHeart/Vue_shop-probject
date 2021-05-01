<template>
  <div>
    <!-- Breadcrumb面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" v-loading="loading" border stripe>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户编号" prop="id" width="80" align="center"></el-table-column>
        <el-table-column label="标题/姓名" prop="username" align="center"></el-table-column>
        <el-table-column label="行业/邮箱" prop="email" align="center"></el-table-column>
        <el-table-column label="电话" prop="mobile" align="center"></el-table-column>
        <el-table-column label="角色" prop="role_name" align="center"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createtime" width="180">
          <template #default="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100%">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatusChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <!-- 编辑用户 -->
            <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">
              </el-button>
            </el-tooltip>
            <!-- 查看用户 -->
            <el-tooltip class="item" effect="dark" content="查看用户" placement="top" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-view"></el-button>
            </el-tooltip>
            <!-- 分配角色 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="success" size="mini" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserById(scope.row.id)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- Element-ui 分页条区域 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

<<<<<<< HEAD
      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户信息"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
        width="30%"
        center>
        <!-- 对话框的内容主体区 -->
        <el-form ref="addFromRef" :model="addFrom" :rules="addFromRules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="addFrom.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 对话框底部区域 -->
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </template>
      </el-dialog>

      <!--  修改用户的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        @close="editDialogClosed"
        width="30%"
        center>
        <el-form ref="editFormRef" :model="editFrom" :rules="editFromRules" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="editFrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
        </template>
      </el-dialog>
=======
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户信息" :visible.sync="addDialogVisible" width="30%" center @close="addDialogClosed">
      <!-- 对话框的内容主体区 -->
      <el-form ref="addFromRef" :model="addFrom" :rules="addFromRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--  修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed" center>
      <el-form ref="editFormRef" :model="editFrom" :rules="editFromRules" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRoleDialogVisible"
      @close="setRoleDialogClosed"
      width="30%"
      center>
      <div>
        <p>当前的用户: {{ userInfo.username}}</p>
        <p>当前的角色: {{ userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
>>>>>>> rights
  </div>
</template>

<script>
  export default {
    // 定义我们该组件中存放哪些私有数据
    data() {
      // 验证邮箱的表单校验规则  自定义的验证规则:  var checkAge 声明一个变量 包括三个参数: rulr: 要验证的规则, value: 需要验证的值, callback: 回调函数
      var checkEmail = (rule, value, callback) => {
        // 验证 email 邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          // 合法的邮箱
          return callback()
        }
        callback(new Error('请输入合法的邮箱!'))
      }
      // 验证手机号的表单校验规则
      var checkMobile = (rule, value, callback) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的手机号!'))
      }
      return {
        // 加载数据时显示动效
        loading: false,
        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 2,
        },
        userlist: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addFrom: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 添加表单的验证规则对象
        addFromRules: {
          username: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '用户名的长度在3~5个字符之间',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入用户密码',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '用户密码的长度在3~5个字符之间',
              trigger: 'blur'
            }
          ],
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的用户信息对象
        editFrom: {},
        // 修改表单的有验证规则对象
        editFromRules: {
          email: [{
              required: true,
              message: '请输入用户邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入用户手机',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        // 控制角色对话框的显示与隐藏
        setRoleDialogVisible: false,
        // 当前即将分配权限角色用户信息 ID
        userInfo: {},
        // 所以角色的数据列表
        rolesList: [],
        // 分配新角色 已选中的角色 Id 值
        selectedRoleId: ''
      }
    },
    // 定义我们生命周期函数
    created() {
      this.getUserList()
    },
    // 定义当前组件中的处理事件函数
    methods: {
      async getUserList() {
        const {
          data: res
        } = await this.$http.get('users', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败!')
        }
        //  这里是给 userlist total 数据赋值
        this.userlist = res.data.users
        this.total = res.data.total
        console.log(res)
      },
      //  监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      // 监听页码值改变的事件
      handleCurrentChange(newPage) {
        // console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      // 监听 swich 开关状态的改变
      async userStatusChanged(userinfo) {
        // console.log(userinfo)
        const {
          data: res
        } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if (res.meta.status !== 200) {
          userinfo.mg_status = !userinfo.mg_status
          return this.$message.error('更新用户状态失败!')
        }
        this.$message.success('更新用户状态成功!')
      },
      //  监听添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFromRef.resetFields()
      },
      // 点击确定按钮, 添加新用户
      addUser() {
        this.$refs.addFromRef.validate(async valid => {
          console.log(valid)
          if (!valid) return
          // 可以发起添加 用户网络请求
          const {
            data: res
          } = await this.$http.post('users', this.addFrom)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败！')
          }
          this.$message.success('添加用户成功！')
          // 如果添加用户成功,并隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取用户的列表的数据
          this.getUserList()
        })
      },
      // 展示编辑用户的对话框
      async showEditDialog(id) {
        // console.log(id)
        const {
          data: res
        } = await this.$http.get('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失败！')
        }
        this.editFrom = res.data
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      // 修改用户信息并提交
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          // console.log(valid)
          if (!valid) return
          // 发起修改用户信息的请求
          const {
            data: res
          } = await this.$http.put('users/' + this.editFrom.id, {
            email: this.editFrom.email,
            mobile: this.editFrom.mobile,
          })
          if (res.meta.status != 200) {
            return this.$message.error('更新用户信息失败!')
          }
          // 1: 关闭对话框
          this.editDialogVisible = false
          // 2: 刷新数据列表
          this.getUserList()
          // 3: 提示用户信息修改成功
          this.$message.success('更新用户信息成功!')
        })
      },
      // 根据Id删除对应的用户信息
      async removeUserById(id) {
        // console.log(id)
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认删除.则返回值为字符串 confirm
        // 如果用户取消了删除.则返回为字符串 cancel
        // console.log(confirmResult)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }

        const {
          data: res
        } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户失败')
        }
        this.$message.success('删除用户成功!')
        this.getUserList()
      },
      // 展示分配角色的对话框
      async setRole (userInfo) {
        this.userInfo = userInfo

        // 在展示对话框之前.获取所有角色的列表
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200 ){
          return this.$message.error('获取角色列表失败！')
        }

        this.rolesList = res.data
        this.setRoleDialogVisible = true
      },
      // 点击按钮,分配角色
      async saveRoleInfo () {
        if (!this.selectedRoleId) {
          return this.$message.error('请选择要分配的角色！')
        }
        const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        })
        if (res.meta.status !== 200) {
          this.$message.error('更新角色失败！')
        }
        this.$message.success('更新角色成功！')
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      // 监听分配角色对话框的关闭事件
      setRoleDialogClosed() {
         this.selectedRoleId = ''
         this.userInfo = {}
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
