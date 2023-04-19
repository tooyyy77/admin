<template lang="">
  <div class="edit">
    <!-- 标题 -->
    <div>标 题：</div>
    <el-input
      v-model="article.title"
      placeholder="请输入标题"
      maxlength="30"
      show-word-limit
    ></el-input>
    <!-- 标签 -->
    <div>标 签：</div>
    <keep-alive>
      <div class="tags">
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput"
          >+ New Tag</el-button
        >
        <el-tag
          :key="tag"
          v-for="tag in article.labels"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
      </div>
    </keep-alive>

    <!-- 简介 -->
    <div>简 介：</div>
    <el-input
      type="textarea"
      :rows="3"
      placeholder="请输入简介"
      v-model="article.gist"
      maxlength="30"
      show-word-limit
    >
    </el-input>
    <div>正 文：</div>
    <!-- markdown编辑器 -->
    <mdEdit ref="mdEdit" :content="this.article.content" />
    <div class="save_button">
      <el-button type="primary" @click="saveArticle">保存</el-button>
    </div>
  </div>
</template>
<script>
import Axios from "@/api/reqAxios.js";
import mdEdit from "./mdEdit.vue";
export default {
  components: {
    mdEdit,
  },
  data() {
    return {
      inputVisible: false,
      inputValue: "",
      article: {
        title: "",
        gist: "",
        content: "",
        labels: [],
      },
    };
  },
  mounted() {
    if (this.$route.params.id) {
      this.getArticle();
    }
  },
  computed: {
    content() {
      return this.$refs.mdEdit.html;
    },
  },
  methods: {
    getArticle() {
      let id = this.$route.params.id;
      Axios.get(`/article/${id}`)
        .then((response) => {
          this.article = response.data.data;
        })
        .catch((error) => {
          this.$message.error(error.data.msg);
        });
    },
    //添加标签相关方法
    handleClose(tag) {
      this.article.labels.splice(this.article.labels.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        if (this.article.labels.includes(inputValue)) {
          this.$message.error("此标签已存在！");
          return;
        } else {
          this.article.labels.push(inputValue);
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    saveArticle() {
      //用于更新文章
      let id = this.$route.params.id;
      let obj = {
        title: this.article.title,
        content: this.content,
        gist: this.article.gist,
        labels: this.article.labels,
      };
      // 表单验证
      if (!this.article.title) {
        this.$message.error("请输入标题！");
        return;
      }
      if (this.content === "<p><br></p>") {
        this.$message.error("正文内容不能为空！");
        return;
      }
      if (id) {
        Axios.put(`/article/${id}`, {
          articleInformation: obj,
        })
          .then((response) => {
            if (response.data.code === "0000") {
              this.$message.success(response.data.msg);
              this.$router.push({
                name: "articleManage",
              });
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        Axios.post("/article", {
          articleInformation: obj,
        })
          .then((response) => {
            if (response.data.code === "0000") {
              this.$message.success(response.data.msg);
              this.$router.push({
                name: "articleManage",
              });
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>
<style lang="less">
.edit {
  margin: 20px 100px;
  & > div {
    margin: 5px;
  }
  .tags {
    & > * {
      margin: 0.3125rem;
    }
    .input-new-tag {
      width: 5rem;
      height: 1.75rem;
    }
  }
  .save_button {
    margin: 0.625rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
