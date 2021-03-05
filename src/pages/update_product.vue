<template>
  <div>
    <el-card class="box-card" v-loading='loading'>
      <div slot="header" class="clearfix">
        <span>修改商品</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="$router.back()"
          >返回</el-button
        >
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <div class="myform">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input v-model="ruleForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="price">
            <el-input v-model.number="ruleForm.price">
              <template slot="prepend">￥</template>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="category">
            <el-select
              v-model="ruleForm.category"
              placeholder="请选择商品分类"
              @change="optionChange"
            >
              <el-option
                :label="item.name"
                :value="item.name"
                v-for="(item, index) in list"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品图片" prop="picture">
            <el-upload
              action="/api/manage/img/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :limit="5"
              :on-success="uploadSuccess"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
          <el-form-item label="商品详情" prop="detail">
            <el-input type="textarea" v-model="ruleForm.detail"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="btn">
              <el-button type="primary" @click="submitForm('ruleForm')"
                >立即修改</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading:true,
      optionValue: "",
      dialogImageUrl: "",
      dialogVisible: false,
      categoryId: "",
      ruleForm: {
        name: "",
        desc: "",
        price: "",
        category: "",
        detail: "",
        picture: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
        desc: [
          { required: true, message: "请输入商品描述", trigger: "blur" },
          { max: 100, message: "最多100 个字符", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { type: "number", message: "价格必须为数字" },
        ],
        category: [
          { required: true, message: "请选择商品分类", trigger: "change" },
        ],
        detail: [
          { required: true, message: "请填写商品详情", trigger: "blur" },
          { max: 50, message: "最多500 个字符", trigger: "blur" },
        ],
        picture: [
          { required: true, message: "请上传商品图片", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      list: (state) => state.categoryList,
      productId: (state) => state.productId,
    }),
  },
  methods: {
    async initData() {
      let res = await this.$API.reqProductInfo(this.productId);
      if (res.status === 0) {
        let { name, detail, price, categoryId, desc } = res.data;
        let result = await this.$API.reqCategoryById(categoryId);
        if (result.status === 0) {
          this.ruleForm.name = name;
          this.ruleForm.desc = desc;
          this.ruleForm.price = price;
          this.ruleForm.detail = detail;
          this.ruleForm.picture = ["imgs"]; //假装有图片
          this.ruleForm.category = result.data.name;
        }
      }
      this.loading=false
    },
    optionChange(value) {
      let id = this.list.find((item) => item.name === value)._id;
      this.categoryId = id;
    },
    uploadSuccess(response, file, fileList) {
      if (fileList.length) this.ruleForm.picture = fileList.length;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getCategoryList() {
      this.$store.dispatch("getCategoryList");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let product = {
            _id: this.productId,
            name: this.ruleForm.name,
            desc: this.ruleForm.desc,
            price: this.ruleForm.price,
            categoryId: this.list.find(
              (item) => item.name === this.ruleForm.category
            )._id,
            detail: this.ruleForm.detail,
          };

          let res = await this.$API.reqUpdateProduct(product);
          if (res.status === 0) {
            this.$message({
              message: "修改商品成功！",
              type: "success",
            });
            this.$router.replace("/admin/product");
          } else {
            this.$message.error("修改商品失败！");
          }
        } else {
          this.$message.error("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  mounted() {
    this.initData();
    this.getCategoryList();
  },
};
</script>
<style lang="less">
.myform {
  width: 60%;
  margin: 0 auto;
  .el-select {
    .el-input {
      width: 200px !important;
    }
  }
  .btn {
    margin-left: 30% !important;
  }
}
</style>