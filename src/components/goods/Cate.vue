<template>
  <div>
     <!-- Breadcrumb面包屑导航区 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>商品管理</el-breadcrumb-item>
       <el-breadcrumb-item>商品分类</el-breadcrumb-item>
     </el-breadcrumb>

     <!-- 卡片视图区域 -->
     <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>

        <!-- 添加分类的对话框 -->
        <el-dialog
          title="添加分类"
          :visible.sync="addCateDialogVisible"
          width="30%"
          @close="addCateDialogClosed"
          center>
          <!-- 添加分类的表单 -->
          <el-form :model="addCateFrom" :rules="addCateFromRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addCateFrom.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
              <!-- Cascader 级联选择:  options: 可选项数据源，键名可通过 Props 属性配置  -->
              <!-- props: 配置选项 props用来指定对象 -->
              <el-cascader
                expand-trigger="hover"
                v-model="selectedkeys"
                :options="parentCateList"
                :props="cascaderProps"
                clearable
                change-on-select
                @change="parentCateChanged">
              </el-cascader>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="addCateDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
          </template>
        </el-dialog>
      </el-row>

      <!-- 表格区域 https://github.com/MisterTaki/vue-table-with-tree-grid/blob/master/README.md-->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index index-text="#" border>
           <!-- 是否有效的 模版 -->
           <template slot="isok" slot-scope="scopte">
             <i class="el-icon-success" v-if="scopte.row.cat_deleted === false " style="color: lightgreen;"></i>
             <i class="el-icon-error" v-else style="color: pink;"></i>
           </template>
           <!-- 排序模版 -->
           <template slot="order" slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
              <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
              <el-tag type="warning" size="mini" v-else>三级</el-tag>
           </template>
           <!-- 操作 -->
           <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
           </template>
      </tree-table>

      <!-- 分页区域 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="querInfo.pagesize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
     </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件 实现数据的分页查询
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表.默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为 table 表格指定列的定义
      columns: [{
         label: '分类名称',
         prop: 'cat_name'
      },
      {
        label: '是否有效',
        type: 'template',
        // 表示当前这一列使用模版名称
        template: 'isok'
       },
       {
         label: '排序',
         // 表示: 将当前列定义为模版列
         type: 'template',
         // 表示: 将当前这一列使用模版名称
         template: 'order'
        },
        {
          label: '操作',
          // 表示: 将当前列定义为模版列
          type: 'template',
          // 表示: 将当前这一列使用模版名称
          template: 'opt'
         },
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateFrom: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的 Id
        cat_pid: 0,
        // 分类的等级.默认要添加的是1 级分类
        cat_level: 0
      },
      // 添加分类的表单的验证规则对象
      addCateFromRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类的名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类的列表 Id
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级的Id数组
      selectedkeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
     const { data: res }  = await this.$http.get('categories',{ params: this.querInfo})
       if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }

      console.log(res.data)
      // 把得到的数据列表,赋值给catelist
      this.catelist = res.data.result
      // 给总数据条数赋值
      this.total = res.data.total
    },
    // 监听 pageSize 改变的时间 实现分页处理
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagnum 页码条改变
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮.展示添加分类的对话框
    showAddCateDialog () {
      // 先获取到父级的数据列表
      this.getParentCateList()
      // 然后在展示成对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类数据列表
    async getParentCateList() {
     const { data: res } = await this.$http.get('categories', {parms: {type: 2}})
     if (res.meta.status !== 200) {
       return this.$message.error('获取商品分类失败！')
     }

      console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectedkeys)
      // 如果selectedkeys 数组中的length 大于 0, 证明选中的父级分类
      // 反之就可以说明没有选中任何父级分类
      if (this.selectedkeys.length > 0 ) {
        //  父级分类的 Id
       this.addCateFrom.cat_pid = this.selectedkeys[this.selectedkeys.length -1]
       //  为当前分类的等级赋值
       this.addCateFrom.cat_level = this.selectedkeys.length
       return
      } else {
        this.addCateFrom.cat_pid = 0
        // 取反 父级的 ID
        this.addCateFrom.cat_level = 0
      }
    },
    // 点击按钮, 并添加新的分类
    addCate () {
      // console.log(this.addCateFrom)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
      const { data: res } = await this.$http.post('categories', this.addCateFrom)
      if (res.meta.status !== 201) {
        return this.$message.error('添加分类失败！')
      }
      this.$message.success('添加分类成功！')
      this.getCateList()
      this.addCateDialogVisible = false
      })
    },
    //  监听对话框的关闭事件,重置表单数据
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedkeys = []
      this.addCateFrom.cat_level = 0
      this.addCateFrom.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
