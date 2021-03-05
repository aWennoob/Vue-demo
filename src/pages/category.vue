<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: right; padding: 3px 0; fontsize: 20px"
          type="text"
          class="el-icon-circle-plus-outline"
          @click="dialogVisible = true"
        >
          添加分类</el-button
        >
      </div>
      <!-- 添加分类菜单 -->
      <el-dialog title="请添加分类名" :visible.sync="dialogVisible" width="40%">
        <el-input v-model="add" placeholder="请输入内容" clearable></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </span>
      </el-dialog>
      <el-table
        :data="total.slice((currpage - 1) * pagesize, currpage * pagesize)"
        border
        style="width: 100%"
        @row-click="getDetails"
        v-loading='loading'
      >
        <el-table-column prop="index" label="分类序列号" align="center">
        </el-table-column>
        <el-table-column prop="categoryName" label="分类名" align="center">
        </el-table-column>
        <el-table-column prop="handle" label="操作" align="center">
          <el-button @click="dialogVisible2 = true" type="text">
            修改分类
          </el-button>
          <el-button @click="dialogVisible3 = true" type="text">
            删除分类
          </el-button>
        </el-table-column>
      </el-table>
      <!-- 修改分类菜单 -->
      <el-dialog
        title="请修改分类名"
        :visible.sync="dialogVisible2"
        width="40%"
      >
        <el-input v-model="update" clearable></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="updateCategory">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 删除分类菜单 -->
      <el-dialog
        title="正在删除分类名"
        :visible.sync="dialogVisible3"
        width="40%"
      >
        <span>确定删除分类：{{ update }} 吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="deleteCategory">确 定</el-button>
        </span>
      </el-dialog>
      <el-pagination
        layout="->,prev, pager, next"
        :total="total.length"
        background
        :page-size="pagesize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: true,
      pagesize: 6,
      currpage: 1,
      total: [], //表格的表头 数据对象{id,categoryName,handle}
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      add: "",
      update: "",
      list: [], // 所有分类的 [id,name]
      row_id: "",
      id: [],
    };
  },
  methods: {
    getDetails(row) {
      if (row) {
        this.update = row.categoryName;
        this.row_id = row.index;
      }
    },
    async deleteCategory() {
      this.dialogVisible3 = false;
      this.loading=true
      //直接发送删除请求获得的row_id数据不准确，不知道为什么？？？
      let res = await this.$API.reqDeleteCategory(this.row_id);
      if (res.status === 0) this.getCategory();
    },
    async updateCategory() {
      this.dialogVisible2 = false;
      this.loading=true
      let res = await this.$API.reqUpdateCategory({
        categoryId: this.row_id,
        categoryName: this.update,
      });
      if (res.status === 0) this.getCategory();
    },

    async handleAdd() {
      this.dialogVisible = false;
      this.loading=true
      let res = await this.$API.reqAddCategory(this.add);
      if (res.status === 0) {
        this.getCategory();
        this.$message({
          message: "添加分类名成功",
          type: "success",
        });
      } else {
        this.$message.error("添加分类名失败");
      }
      this.add = "";
    },
    async getCategory() {
      let res = await this.$API.reqCategory();
      if (res.status === 0) {
        this.total = [];
        this.list = [];

        this.list = res.data;
        this.list.forEach((item) =>
          this.total.unshift({
            index: item._id,
            categoryName: item.name,
          })
        );
        this.loading=false
      } else {
        alert("获取分类失败");
      }
    },
    handleCurrentChange(cpage) {
      this.currpage = cpage;
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
    },
  },
  mounted() {
    this.getCategory();
    this.getDetails();
  },
};
</script>
<style lang="less" scope>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>