<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-input
          placeholder="请输入内容"
          v-model="searchName"
          class="input-with-select"
        >
          <el-select
            v-model="select"
            slot="prepend"
            placeholder="请选择关键词"
            @change="type"
          >
            <el-option label="按名称搜索" value="productName"></el-option>
            <el-option label="按描述搜索" value="productDesc"></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search"
          ></el-button>
          <el-button slot="append" @click="reset">reset</el-button>
        </el-input>
        <el-button
          style="float: right; padding: 3px 0; fontsize: 20px"
          type="text"
          class="el-icon-circle-plus-outline"
          @click="$router.push('/admin/application/product/addproduct')"
          >添加商品</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @row-click="getDetails"
       v-loading="loading"
      >
        <el-table-column prop="name" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="id" label="商品序列号" width="250">
        </el-table-column>
        <el-table-column prop="desc" label="商品描述"> </el-table-column>
        <el-table-column prop="price" label="价格/元" width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="180">
        </el-table-column>
        <el-table-column label="操作" width="300">
           <template slot-scope="scope">
          <el-button
            type="primary"
            round
            size="mini"
            @click="dialogVisible = true"
            :disabled="scope.row.status==='已上架'"
            >上架</el-button
          >
          <el-button
            type="warning"
            round
            size="mini"
            @click="dialogVisible = true"
            :disabled="scope.row.status==='已下架'"
            >下架</el-button
          >
          <el-button type="text" @click="productDetail(scope.$index,scope.row)" >商品详情</el-button>
          <el-button type="text" @click="updateProduct(scope.$index,scope.row)">修改商品</el-button>
           </template>
        </el-table-column>
      </el-table>
      <!-- 确认上下架菜单 -->
      <el-dialog
        :title="status === 1 ? '下架' : '上架'"
        :visible.sync="dialogVisible"
        width="40%"
      >
        <span
          >你需要 {{ status === 1 ? "下架" : "上架" }} 商品
          {{ name }} 吗？</span
        >
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sale">确 定</el-button>
        </span>
      </el-dialog>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page.sync="currentpage"
        :page-size="pagesize"
        layout="->,prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import {GET_PRODUCT_ID} from '../vuex/mutation-types'
export default {
  data() {
    return {
      loading: true,
      dialogVisible: false,
      name: "",
      status: "",
      productId: "",
      isSearch: false,
      searchType: "",
      searchName: "",
      select: "",
      pagesize: 6,
      currentpage: 1,
      total: 1,
      tableData: [],
    };
  },
  methods: {
    updateProduct(index,row){
      this.$store.commit(GET_PRODUCT_ID,row.id)
      this.$router.push('/admin/application/product/updateproduct')
    },
  productDetail(index,row){
    this.$router.push('/admin/application/product/detailproduct')
    this.$store.commit(GET_PRODUCT_ID,row.id)
  },
    getDetails(row) {
      if (row) {
        this.name = row.name;
        this.productId = row.id;
        this.status = row.status === "已上架" ? 1 : 2;
     
      }
    },
    async sale() {
      this.dialogVisible = false;
      this.loading=true
      this.status = this.status === 1 ? 2 : 1;
      let res = await this.$API.reqUpdateStatus(this.productId, this.status);
      console.log(res);
      if (res.status === 0) this.getProductList(this.currentpage);
    },
    reset() {
      this.isSearch = false;
      this.searchType = "";
      this.searchName = "";
      this.getProductList(1);
    },
    async search() {
      this.isSearch = true;
      this.loading=true
      let res = await this.$API.reqSearchProducts({
        pageNum: this.currentpage,
        pageSize: this.pagesize,
        searchName: this.searchName,
        searchType: this.searchType,
      });
      if (res.status === 0) {
        this.total = res.data.total;
        this.tableData = [];
        res.data.list.forEach((item) => {
          this.tableData.push({
            name: item.name,
            id: item._id,
            desc: item.desc,
            price: item.price,
            status: item.status === 1 ? "已上架" : "已下架",
            handle: "",
          });
        });
        this.loading=false
      }
    },
    type(type) {
      this.searchType = type;
    },
    async handleCurrentChange(current) {
      if (this.isSearch) {
        this.loading=true
        let res = await this.$API.reqSearchProducts({
          pageNum: current,
          pageSize: this.pagesize,
          searchName: this.searchName,
          searchType: this.searchType,
        });
        if (res.status === 0) {
          this.total = res.data.total;
          this.tableData = [];
          res.data.list.forEach((item) => {
            this.tableData.push({
              name: item.name,
              id: item._id,
              desc: item.desc,
              price: item.price,
              status: item.status === 1 ? "已上架" : "已下架",
          
            });
          });
          this.loading=false
        }
      } else {
        this.getProductList(current);
      }
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
    },
    async getProductList(current) {
      this.currentpage = current;
      let res = await this.$API.reqProducts(current, this.pagesize);
      if (res.status === 0) {
        this.total = res.data.total;
        this.tableData = [];
        res.data.list.forEach((item) => {
          this.tableData.push({
            name: item.name,
            id: item._id,
            desc: item.desc,
            price: item.price,
            status: item.status === 1 ? "已上架" : "已下架",    
          });
        });
        this.loading=false
      }
    },
  },
  mounted() {
    this.getDetails();
    this.getProductList(1);
  },
};
</script>
<style lang="less" scope>
.el-select .el-input {
  width: 130px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-input-group {
  width: 50% !important;
}
</style>