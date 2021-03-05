<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>角色权限管理</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          class="el-icon-circle-plus-outline"
          @click="dialogVisible1 = true"
          >添加角色</el-button
        >
      </div>
      <el-table :data="tableData.slice((currentpage - 1) * pagesize, currentpage * pagesize)" border style="width: 100%" v-loading='loading'>
        <el-table-column prop="name" label="角色名称"> </el-table-column>
        <el-table-column prop="create_time" label="创建时间"> </el-table-column>
        <el-table-column prop="role_id" label="角色ID"> </el-table-column>
        <el-table-column prop="auth_name" label="授权人"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleSet(scope.$index, scope.row)"
              >设置权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="->,prev, pager, next"
        background
        :page-size="pagesize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :total="tableData.length"
      >
      </el-pagination>
      <!-- 设置权限菜单 -->
      <el-dialog
        title="设置权限"
        :visible.sync="dialogVisible2"
        width="40%"
        :before-close="handleClose"
      >
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          default-expand-all
          ref="tree"
          :props="defaultProps"
        >
        </el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSetOk">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加角色菜单 -->
      <el-dialog
        title="添加角色"
        :visible.sync="dialogVisible1"
        width="40%"
        :before-close="handleClose"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="role_name">
            <el-input
              v-model="ruleForm.role_name"
              placeholder="请输入角色名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
import dayjs from "dayjs";

export default {
  data() {
    return {
       currentpage: 1,
      pagesize: 6,
      loading:true,
      row_create_time: "",
      row_name: "",
      row_id: "",
      checkedNodes: [],
      data: [
        {
          id: 'all',
          label: "所有权限",
          children: [
            {
              id: '/admin/application',
              label: "应用管理",
              children: [
                {
                  id: '/admin/application/category',
                  label: "分类管理",
                },
                {
                  id: '/admin/application/product',
                  label: "商品管理",
                },
              ],
            },
            {
              id: '/admin/user',
              label: "用户管理",
            },
            {
              id:  '/admin/role',
              label: "权限管理",
            },
            {
              id:  '/admin/chart',
              label: "图形列表",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      auth_name: "",
      auth_time: "",
      ruleForm: { role_name: "" },
      rules: {
        role_name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      dialogVisible2: false,
      dialogVisible1: false,
      tableData: [],
    };
  },
  computed: {
    ...mapState(["username"]),
  },
  methods: {
    handleCurrentChange(cpage) {
      this.currentpage = cpage;
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
    },
    //设置权限
    async handleSetOk() {
      this.dialogVisible2 = false;
      let menus = this.$refs.tree.getCheckedNodes();
      menus = menus[0].label === "所有权限" ? menus.slice(1) : menus;
      menus.unshift({ id: '/admin/home', label: "首页" });
      this.checkedNodes = menus;

      window.addEventListener("beforeunload", () => {
          sessionStorage.setItem("username", this.username);
        });
      let role = {
        _id: this.row_id,
        name: this.row_name,
        auth_name:this.username? this.username: sessionStorage.getItem("username"),
        create_time: this.row_create_time,
        menus: this.checkedNodes,
      };
      let res = await this.$API.reqUpdateRole(role);
      // console.log(res);
      if (res.status === 0) {
        this.auth_name=res.data.auth_name
        this.getRoles()
        this.$message({
          message: "设置角色权限成功",
          type: "success",
        });
      }
    },
    handleSet(index, row) {
      this.dialogVisible2 = true;
      if (row) {
        this.row_id = row.role_id;
        this.row_name = row.name;
        this.row_create_time = row.create_time;
      }
    },
    handleClose() {
      if (this.$refs["ruleForm"]) {
        this.$refs["ruleForm"].resetFields();
        this.dialogVisible1 = false;
      }
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([]);
        this.dialogVisible2 = false;
      }
    },
    //添加角色
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.dialogVisible1 = false;
          let roleName = this.ruleForm.role_name;
          let res = await this.$API.reqAddRole(roleName);

          if (res.status === 0) {
            this.getRoles();
            this.$message({
              message: "添加角色成功",
              type: "success",
            });
          }
          this.$refs[formName].resetFields()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getRoles() {
      let res = await this.$API.reqRoles();

      if (res.status === 0) {
        
        this.tableData=[]
        res.data.forEach((item) => {
          this.tableData.push({
            name: item.name,
            create_time:item.create_time.split('').length <15 ? dayjs(item.create_time*1).format("YYYY年 MM月DD日 HH:mm:ss"): item.create_time,
            role_id: item._id,
            auth_name: item.auth_name,
            
          });
        });
      }
      this.loading=false
    },
  },
  mounted() {
    this.getRoles();
  },
};
</script>
<style lang="less" scope>
</style>