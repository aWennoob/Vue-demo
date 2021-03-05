<template>
  <header>
    <div class="header-top">
      <span>Welcome,{{ user }}</span>
      <el-divider direction="vertical"></el-divider>
      <el-button
        type="text"
        size="medium"
        plain
        @click="centerDialogVisible = true"
        class="logout"
        >退出登录</el-button
      >
      <el-dialog
        title="Warning"
        :visible.sync="centerDialogVisible"
        width="35%"
        center
      >
        <span>确定退出登录吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="logout">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="header-bottom">
      <div class="header-bottom-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in title" :key="index" >{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-bottom-right">{{ time }}</div>
    </div>
  </header>
</template>
<script>
import { mapState } from "vuex";
import { USER_INFO } from "../vuex/mutation-types";
import dayjs from "dayjs";
export default {
  data() {
    return {
      centerDialogVisible: false,
      time: dayjs().format("YYYY年 MM月DD日 HH:mm:ss"),
      // title: "",
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.username,
    }),
    title() {
      let arr= this.$route.path.split("/")
      arr.splice(0,2,'Hello Word')
      return arr
    },
  },
  methods: {
    logout() {
      this.$router.replace("/login");
      localStorage.removeItem("token_key");
      const data = "";
      this.$store.commit(USER_INFO, data);
    },
  },
  mounted() {
    this.timeID = setInterval(() => {
      this.time = dayjs().format("YYYY年 MM月DD日 HH:mm:ss");
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timeID);
  },
};
</script>
<style lang="less">
header {
  background: white;
  height: 10vh;
  min-height: 10vh;
  .header-top {
    height: 5vh;
    min-height: 5vh;
    border-bottom: 1px solid #cccc;
    text-align: right;
    line-height: 5vh;
    span {
      margin: 0 15px;
    }
    .logout {
      margin: 0 20px;
    }
    .el-dialog__body {
      text-align: center;
    }
  }
  .header-bottom {
    display: flex;
    line-height: 5vh;
    min-height: 5vh;
    height: 5vh;
    .header-bottom-left {     
      width: 40%;
      text-align: center;
      .el-breadcrumb {
        line-height: 5vh;
        font-size: 17px;
        margin: 0 0 0 15px;
        :last-child {
          transition: all .5s;
           position: relative;
          // ::after {
          //   right: 0;
          //   transform: translateX(-10%);
          //   position: absolute;
          //   top: 5vh;
          //   content: "";
          //   border-left: 20px solid transparent;
          //   border-right: 20px solid transparent;
          //   border-top: 20px solid white;
          //   border-bottom: 20px solid transparent;
            
          // }
        }
      }
    }
    .header-bottom-right {
      width: 60%;
      text-align: right;
      margin-right: 20px;
    }
  }
}
</style>