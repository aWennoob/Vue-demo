<template >
  <div>
    <div v-for="menu in menus" :key="menu.title">
      <div v-if="menu.children">
        <el-submenu :index="menu.path" :key="menu.path">
          <template slot="title">
            <i :class="menu.icon_class"></i>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              :index="child.path"
              v-for="child in menu.children"
              :key="child.path"
            >
              <span class="item">{{ child.title }}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </div>
      <div v-else>
        <el-menu-item :index="menu.path" :key="menu.path"> 
          <i :class="menu.icon_class"></i>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "menus",
  props: { menus: { type: Array, required: true } },
};
</script>
