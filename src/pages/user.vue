<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户管理</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          class="el-icon-circle-plus-outline"
          @click="dialogVisible1 = true"
          >创建用户</el-button
        >
      </div>
      <el-table
        :data="
          tableData.slice((currentpage - 1) * pagesize, currentpage * pagesize)
        "
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="create_time" label="注册时间"> </el-table-column>
        <el-table-column prop="user_id" label="用户ID"> </el-table-column>
        <el-table-column prop="role" label="角色权限"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
              >修改用户</el-button
            >
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除用户</el-button
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
      <!-- 删除 用户菜单 -->
      <el-dialog
        title="删除用户"
        :visible.sync="dialogVisible3"
        width="40%"
        :before-close="reset"
      >
        <span>你确定要删除用户 {{ ruleForm2.name }} 吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="deleteUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 更新 用户菜单 -->
      <el-dialog
        title="更新用户"
        :visible.sync="dialogVisible2"
        width="40%"
        :before-close="reset"
      >
        <el-form
          :model="ruleForm2"
          :rules="rules2"
          ref="ruleForm2"
          label-width="100px"
        >
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="ruleForm2.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm2.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm2.email"></el-input>
          </el-form-item>
          <el-form-item label="角色权限" prop="role">
            <el-select v-model="ruleForm2.role" placeholder="选择角色">
              <el-option
                :label="item.name"
                :value="item.name"
                v-for="item in options"
                :key="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reset">取 消</el-button>
          <el-button type="primary" @click="updateUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加 用户菜单 -->
      <el-dialog
        title="创建用户"
        :visible.sync="dialogVisible1"
        width="40%"
        :before-close="reset"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="角色权限" prop="role">
            <el-select v-model="ruleForm.role" placeholder="选择角色">
              <el-option
                :label="item.name"
                :value="item.name"
                v-for="item in options"
                :key="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reset">取 消</el-button>
          <el-button type="primary" @click="createUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import dayjs from "dayjs";
export default {
  data() {
    return {
      currentpage: 1,
      pagesize: 6,
      loading: true,
      user_id: "",
    //   optionName:'',
      options: [],
      ruleForm: {
        name: "",
        password: "",
        phone: "",
        email: "",
        role: "",
      },
      ruleForm2: {
        name: "",
        phone: "",
        email: "",
        role: "",
      },
      rules: {
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        role: [{ required: true, message: "请选择角色权限", trigger: "blur" }],
      },
      rules2: {
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        role: [{ required: true, message: "请选择角色权限", trigger: "blur" }],
      },
      dialogVisible1: false, //add
      dialogVisible2: false, //update
      dialogVisible3: false, //delete
      tableData: [],
    };
  },
  methods: {
    handleCurrentChange(cpage) {
      this.currentpage = cpage;
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
    },
    async deleteUser() {
      let res = await this.$API.reqDeleteUser(this.user_id);
      if (res.status === 0) {
        this.dialogVisible3 = false;
        this.$message({
          message: "删除用户成功",
          type: "success",
        });
        this.getUsers();
      }
    },
    handleDelete(index, row) {
      this.dialogVisible3 = true;
      this.user_id = row.user_id;
      this.ruleForm2.name = row.username;
    },
    updateUser() {
      this.$refs.ruleForm2.validate(async (valid) => {
        if (valid) {
          this.dialogVisible2 = false;
          let user = {
            _id: this.user_id,
            username: this.ruleForm2.name,
            password: this.ruleForm2.password,
            phone: this.ruleForm2.phone,
            email: this.ruleForm2.email,
            role_id: this.options.find(
              (item) => item.name === this.ruleForm2.role
            )._id,
          };
          let res = await this.$API.reqUpdateUser(user);
          if (res.status === 0) {
            this.getUsers();
            this.$message({
              message: "修改用户成功",
              type: "success",
            });
          }
          this.isUpdate = false;
        }
      });
    },
    handleUpdate(index, row) {
      this.dialogVisible2 = true;

      this.ruleForm2.name = row.username;
      this.ruleForm2.phone = row.phone;
      this.ruleForm2.email = row.email;
      this.ruleForm2.role = row.role;
      this.user_id = row.user_id;
    },
    async getRole() {
      let res = await this.$API.reqRoles();

      if (res.status === 0) {
        this.options = res.data;
      }
    },
    async getUsers() {
      let res = await this.$API.reqUsers();

      if (res.status === 0) {
        this.tableData = [];
        res.data.users.forEach((item) => {        
            this.tableData.push({
              username: item.username,
              email: item.email,
              phone: item.phone,
              create_time: dayjs(item.create_time).format(
                "YYYY年 MM月DD日 HH:mm:ss"
              ),
              user_id: item._id,
              role:this.options ?this.options.find((option) => option._id === item.role_id).name:''
            });
          
        });
      }
      this.loading = false;
    },
    createUser() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.dialogVisible1 = false;
          let user = {
            username: this.ruleForm.name,
            password: this.ruleForm.password,
            phone: this.ruleForm.phone,
            email: this.ruleForm.email,
            role_id: this.options.find(
              (item) => item.name === this.ruleForm.role
            )._id,
          };
          let res = await this.$API.reqAddUser(user);

          if (res.status === 0) {
            this.getUsers();
            this.$message({
              message: "创建用户成功",
              type: "success",
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reset() {
      this.dialogVisible1 = false;
      this.dialogVisible2 = false;
      this.dialogVisible3 = false;
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
      if (this.$refs.ruleForm2) this.$refs.ruleForm2.resetFields();
    },
  },
  mounted() {
    this.getRole();
    this.getUsers();
  },
};
</script>
<style lang="less" scope>
</style>