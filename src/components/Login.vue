<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFromRef" :model="loginFrom" :rules="loginFromRules" label-width="0px" class="login_from">
        <!-- 用户表单 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" placeholder="请输入账号" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码表单 -->
        <el-form-item prop="password">
          <el-input v-model="loginFrom.password" placeholder="请输入密码" prefix-icon="el-icon-unlock" type="password"></el-input>
        </el-form-item>
         <hr>
         <br>
         <!-- 按钮区域 -->
        <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<!--  行为 -->
<script>
export default {
  data () {
    return {
      // 这是登表单的数据绑定对象
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规定对象
      loginFromRules: {
        // 验证用户 是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // 验证用户密码 是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮,重置登录表单
    resetLoginFrom () {
      // 打印输出 vm 实例 this
      // console.log(this)
      this.$refs.loginFromRef.resetFields()
      this.$message.info('重置成功!')
    },
    // 点击@click 触发点击事件 完成登录表单预验证功能
    login () {
      this.$refs.loginFromRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginFrom)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功!')
        // 1: 将登录成功之后 token,保存到客户端 sessionStorage 中
        // 1.1:  对于项目中出了登录之外的其他 API 接口,必须在登录才能访问
        // 1.2: token只应下当前网站打开期间生效,所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2: 通过编程式导航跳转到后台主页,路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<!-- css 的样式/表现 -->
<style lang="less" scoped>
.login_container {
  background: url() #99f repeat-y fixed;
  height: 100%;
}
/* 登录组件 */
.login_box {
  /* 宽 */
  width: 450px;
  /* 高 */
  height: 350px;
  /* 背景颜色 */
  background-color: #fff;
  /* 外边距圆角 */
  border-radius: 15px;
  /* 绝对定位 */
  position: absolute;
  /* 距离右上角 */
  left: 50%;
  /* 上边距 */
  top: 50%;
  /* 平移/变化 */
  transform: translate(-50%, -50%);
}
/* 图片的合资模型 */
.avatar_box {
  /* 高 */
  height: 130px;
  /* 宽 */
  width: 130px;
  /* 边框线 */
  border: 1px solid #eee;
  /* 外边距圆角 */
  border-radius: 50%;
  /* 属性用于在元素的框架上添加阴影效果 */
  box-shadow: 0 0 10px #ddd;
  /* 内填充 */
  padding: 10px;
  /* 绝对定位 */
  position: absolute;
  /* 距离右上角 */
  left: 50%;
  /*  平移 */
  transform: translate(-50%, -50%);
  background-color: #fff;
}
/* 图片样式 */
img {
  /* 宽 */
  width: 100%;
  /* 高 */
  height: 100%;
  /* 边框圆角 */
  border-radius: 40%;
  background-color: #eee;
}
/* 登录表单 */
.login_from {
  /* 绝对定位 */
  position: absolute;
  bottom: 0;
  /* 宽 */
  width: 100%;
  /* 属于用于设置多行元素空间量,如多行文本的间距 */
  line-height: 30px;
  /* 上边距 */
  top: 111px;
  /* 内填充 */
  padding: 0 30px;
  /* 应该如何计算一个元素的总宽度和总高度 */
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
</style>
