<template>
  <div class="login">
    <header>
      <img src="../assets/logo.png" alt="logo" />
      <h1>Hello Wrold</h1>
    </header>
    <section>
      <h1>用户登录</h1>
      <el-form :model="formData" status-icon :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="formData.username"
            autocomplete="off"
            prefix-icon="el-icon-user-solid"
            minlength="4"
            maxlength="12"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="formData.password"
            autocomplete="off"
            prefix-icon="el-icon-lock"
            show-password
            minlength="4"
            maxlength="12"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="login('loginForm')"
            class="btn-login"
            >LOGIN</el-button
          >
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (value.split("").length < 4) {
        callback(new Error("用户名最少4位"));
      } else if (!/^\w+$/.test(value)) {
        callback(new Error("用户名由字母、数字、下划线组成"));
      } else {
        callback();
      }
    };
    let validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.split("").length < 4) {
        callback(new Error("密码最少4位"));
      } else if (!/^\w+$/.test(value)) {
        callback(new Error("密码由字母、数字、下划线组成"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState({
      token:state=>state.token,
    })
  },
  methods: {
    login(refname) {
      this.$refs[refname].validate(async (v) => {
        if (v) {
          let { username, password } = this.formData;
          this.$store.dispatch('getUserInfo',{ username, password})        
        } else {
          alert("username or password error!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scope>
.login {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to left top,
    rgba(4, 135, 168, 0.979),
    rgb(1, 214, 186)
  );
  header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 80px;
    background-color: #555b68;
    opacity: 0.9;
    img {
      width: 50px;
      height: 50px;
      margin: 10px;
    }
    h1 {
      color: whitesmoke;
      font-size: 30px;
      line-height: 30px;
      margin-bottom: 0px;
    }
  }
  section {
    width: 400px;
    height: 320px;
    padding: 30px;
    background: whitesmoke;
    border-radius: 5px;
    margin: 100px auto 0;
    h1 {
      font-size: 25px;
      text-align: center;
      margin-top: 10px;
      margin-bottom: 35px;
    }
    .btn-login {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>