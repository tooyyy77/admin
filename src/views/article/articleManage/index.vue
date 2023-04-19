<template>
  <el-table
    :data="articleList"
    cell-class-name="table"
    stripe
    :default-sort="{ prop: 'date', order: 'descending' }"
  >
    <el-table-column
      prop="date"
      label="日期"
      sortable
      width="200"
      :formatter="formatter"
    >
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px" :formatter="formatter">{{
          formatter(scope.row)
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="标题" sortable width="300">
    </el-table-column>
    <el-table-column prop="gist" label="描述"> </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="danger"
          @click="deleteConfirm(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Axios from "@/api/reqAxios.js";
export default {
  data() {
    return {
      articleList: [],
    };
  },
  mounted() {
    this.getArticleList();
  },
  methods: {
    getArticleList() {
      Axios.get("/article")
        .then((response) => {
          this.articleList = response.data.data;
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },
    // 格式化日期
    formatter(row, column) {
      const dateObj = new Date(row.date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      row.date = `${year}-${month}-${day}`;
      return row.date;
    },
    //  编辑文章
    handleEdit(index, row) {
      let id = row._id;
      this.$router.push({
        name: "articleEdit",
        params: { id },
      });
    },
    // 删除文章
    deleteConfirm(index, row){    this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleDelete(row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

    handleDelete(row) {
      let id = row._id;
      Axios.delete(`/article/${id}`)
        .then((response) => {
          if (response.data.code === "0000") {
            this.$message.success(response.data.msg);
            this.getArticleList();
          } else {
            this.$message.error(response.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style lang="less">
.table {
  width: 100%;
  .cell {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
