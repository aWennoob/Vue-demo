<template>
  <el-container class="admin">
    <Aside></Aside>
    <el-container>
      <Header></Header>
      <el-main class="main">        
        <router-view></router-view>
      </el-main>
      <el-footer class="footer">Hello Wrold Created By Vue--Footer</el-footer>
    </el-container>
  </el-container>
</template>
<script>
import Header from "./header";
import Aside from "./aside";
export default {
  name: "admin",
  components: {
    Header,
    Aside,
  },

};
</script>
<style lang="less" scope>
html,body{
  height: 100%;
  background-color:rgba(177, 221, 210, 0.349);
}
.admin {
  height: 100%;
    .main {
      // background-color: rgba(177, 221, 210, 0.349);
      margin: 20px 20px 0 20px;      
    }
    .el-main{
      padding: 0;
    }
    .footer {
      text-align: center;
    }
}
</style>