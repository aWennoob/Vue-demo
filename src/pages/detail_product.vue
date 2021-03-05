<template>
  <div>
    <el-card class="box-card" v-loading='loading' >
      <div slot="header" class="clearfix">
        <span>商品详情</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="$router.back()"
          >返回</el-button
        >
      </div>
      <div >
        <div class="title">商品名称：</div>
        <span>{{ productInfo.name }}</span>
        <el-divider></el-divider>
        <div class="title">商品描述：</div>
        <span>{{ productInfo.desc }}</span>
        <el-divider></el-divider>
        <div class="title">商品价格：</div>
        <span>{{ productInfo.price }}</span>
        <el-divider></el-divider>
        <div class="title">商品分类：</div>
        <span>{{ this.categoryName }}</span>
        <el-divider></el-divider>
        <div class="title">商品图片：</div>
        <span>{{ productInfo.imgs }}</span>
        <el-divider></el-divider>
        <div class="title">商品详情：</div>
        <span>{{ productInfo.detail }}</span>
        <el-divider></el-divider>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading:true,
      productInfo: "",
      categoryName: "",
    };
  },
  computed: {
    ...mapState({ productId: (state) => state.productId }),
  },
  methods: {
    async getProductInfo() {
      let res = await this.$API.reqProductInfo(this.productId);

      if (res.status === 0) {
        this.productInfo = res.data;
        let result = await this.$API.reqCategoryById(res.data.categoryId);
        if (result.status === 0) {
          this.categoryName = result.data.name;
        }
      }
      this.loading=false
    },
  },
  mounted() {
    this.getProductInfo();
  },
};
</script>
<style lang="less">

.title {
  display: inline-block;
  font-size: 25px;

}


</style>