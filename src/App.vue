<template>
  <div id="app">
    <router-view ></router-view>
  </div>
</template>

<script>
import { USER_INFO } from "./vuex/mutation-types";
export default {
  name:'App',
  async mounted() {
    //自动登录
    let res = await this.$API.autoLogin();
    if (res.status === 0) this.$router.replace("/admin");
    let token = localStorage.getItem("token_key");
    res.data.token = token;

    this.$store.commit(USER_INFO, res.data);
  },
};
</script>

<style scope>
</style>
