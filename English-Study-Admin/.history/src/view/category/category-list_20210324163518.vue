<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header"><div class="title">文章列表</div></div>
      <!-- 表格 -->
      <my-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @handleView="handleView"
        @row-click="rowClick"
        v-loading="loading"
      ></my-table>
      <table-paper class="table-paper" :currPageNum="page.index" :PagerOrder="page" @tablePaperEven="tablePaperChange"></table-paper>
    </div>

    <!-- 编辑页面 -->
    <category-modify v-else @editClose="editClose" :rowObj="rowObj"></category-modify>
  </div>
</template>

<script>
import category from '@/model/category'
import MyTable from '@/component/base/table/my-table'
import tablePaper from '@/component/base/tablePaper/tablePaper'
import categoryModify from './category-modify'

export default {
  components: {
    MyTable,
    categoryModify,
    tablePaper,
  },
  data() {
    return {
      tableColumn: [
        { prop: 'id', label: 'ID' },
        { prop: 'category_name', label: '分类名称' },
      ],
      tableData: [],
      operate: [],
      page: {
        size: 5,
        count: 8,
        index: 1,
      },
      showEdit: false,
      rowObj: {},
      loading: false,
      currentPage3: 4,
    }
  },
  async mounted() {
    this.loading = true
    await this.getArticles()
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除图书',
      },
      {
        name: '查看文章',
        func: 'handleView',
        type: 'primary'
      },
    ]
    this.loading = false
  },
  methods: {
    // 查看文章
    handleView(val){
      console.log(val)
    },
    // 分页点击
    tablePaperChange(data) {
      this.page.index = data
      this.getArticles(this.page)
    },
    async getArticles() {
      try {
        const categorys = await category.getArticles(this.page)
        this.page.count = categorys.total
        this.tableData = categorys.data

        this.tableData.forEach(item=>{
          // 处理布尔值显示
          item.show_is_published = !!item.is_published ? '是' : '否'
          item.show_is_comment_enabled = !!item.is_comment_enabled ? '是' : '否'
          item.show_is_top = !!item.is_top ? '是' : '否'
        })
      } catch (error) {
        // 资源不存在
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    // 删除
    handleEdit(val) {
      this.showEdit = true
      this.rowObj = val.row
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该文章 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await category.deleteArticle(val.row.id)
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
          
          this.getArticles(this.page)
        }
      })
    },
    rowClick() {},
    editClose() {
      this.showEdit = false
      this.getArticles()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .table-paper {
    margin-top: 20px;
  }
}
</style>
