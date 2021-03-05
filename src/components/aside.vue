<template>
  <div class="aside">
    <div class="aside-top">
      <img src="../assets/logo.png" alt="logo" />
      <h1>Hello Wrold</h1>
    </div>
    <div class="aside-bottom">
    <!-- 创建动态菜单 -->
    <el-menu router :default-active="this.$route.path">
      <Menus :menus="menus" />
    </el-menu>
    </div>
  </div>
</template>
<script>
import Menus from "./menus";
export default {
  components: { Menus },
  data() {
    return {
      menus: [],
    };
  },
  mounted() {
    const data = [
      { title: "首页", icon_class: "el-icon-s-home", path: "/admin/home" },
      {
        title: "应用管理",
        icon_class: "el-icon-menu",
        path: "/admin/application",
        children: [
          { title: "分类管理", path: "/admin/application/category" },
          { title: "商品管理", path: "/admin/application/product" },
        ],
      },
      {
        title: "用户管理",
        icon_class: "el-icon-user",
        path: "/admin/user",
      },
      {
        title: "权限管理",
        icon_class: "el-icon-setting",
        path: "/admin/role",
      },
      {
        title: "图形列表",
        icon_class: "el-icon-s-data",
        path: "/admin/chart",
      },
    ];
    // this.menus=data
    let list = JSON.parse(localStorage.getItem("menus"));
    // 0: {id: "/admin/home", label: "首页"}
    // 1: {id: "/admin/chart", label: "图形列表"}
    let arr = [];
    let childrenArr = [];
    list
      .filter((item) => item.id.split("/").length > 3)
      .map((m) => {
        childrenArr.push({
          title: m.label,
          path: m.id,
        });
      });

    list.map((item) => {
      let obj = data.find((m) => m.title === item.label);

      if (!item.children && item.id.split("/").length == 3) {
        arr.push({
          title: item.label,
          icon_class: obj ? obj.icon_class : "",
          path: item.id,
        });
      }

      if (item.children) {
        arr.push({
          title: item.label,
          icon_class: obj ? obj.icon_class : "",
          path: item.id,
          children: childrenArr,
        });
      }
    });
    if (list.length > 0) this.menus = arr;
    else this.menus = data;
  },
};
</script>
<style lang="less" scope>
@import "../../public/css/reset.css";
.aside {
  width: 280px;
  height: 100%;
  
  .aside-top {
    width: 100%;
    height: 10vh;
    min-height: 10vh;
    display: flex;
    align-items: center;
    // justify-content: space-around;
    justify-content: center;
    // background-color: rgba(12, 230, 102, 0.514);
    img {
      width: 40px;
      height: 40px;
    }
    h1 {
      font-size: 30px;
      margin-bottom: 0;
      font-weight: bold;
    }
  }
  .aside-bottom{
    height:90vh;
    background-color: white;
  }
  i {
    margin: 0 15px 0 25px !important;
  }
  .el-menu-item-group__title {
    height: 0;
    padding: 0;
  }
  .item {
    margin-left: 50px;
  }
}
</style>