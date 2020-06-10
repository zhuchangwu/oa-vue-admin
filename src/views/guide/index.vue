<template>
  <div style="padding: 30px">
    <el-row>
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="inputSearch">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" icon="el-icon-search" @click="doInputSearch">搜索</el-button>
        <el-button type="success" @click="showCreateFlowTemplateModal">创建流程</el-button>
      </el-col>
    </el-row>
    <div class="myDiv">
      <el-table
        :data="currentPageData"
        style="width: 100%">
        <el-table-column
          label="#Id"
          width="90"
          prop="id">
        </el-table-column>
        <el-table-column
          label="流程名称"
          width="230"
          prop="flowTemplateName">
        </el-table-column>
        <el-table-column
          label="创建者"
          width="230"
          prop="createrUsername">
        </el-table-column>
        <el-table-column
          label="审批节点"
          width="230"
          prop="flowNodes">
        </el-table-column>
        <el-table-column
          label="操作"
          width="229"
          align="left">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block myDiv">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 25]"
        :pageSize="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="模版信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-position="left">
        <el-form-item style="display:none" label="id" :label-width="formLabelWidth">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="流程名称" :label-width="formLabelWidth">
          <el-input v-model="form.flowTemplateName" autocomplete="off" placeholder="请输入流程名～"></el-input>
        </el-form-item>
        <el-form-item label="创建者" :label-width="formLabelWidth">
          <el-input v-model="form.createrUsername" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="审批节点" :label-width="formLabelWidth">
          <el-input v-model="form.flowNodes" autocomplete="off" placeholder="1=manager&2=boss"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseEdit">取 消</el-button>
        <el-button type="primary" @click="handleDoEditOrCreate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import { createOrUpdateFlowTemplate, doGetFlowTemplateByPage } from '@/api/flowTemplate'
  import { Message } from 'element-ui'

  export default {
    name: 'complex-table',
    data() {
      return {
        inputSearch: '',
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSize: 10, // 每页大小
        currentPageData: [], // 当前页的数据
        dialogFormVisible: false,
        form: {
          flowTemplateName: '',
          createrUsername: '',
          flowNodes: ''
        },
        formLabelWidth: '120px'
      }
    },
    created() {
      this.form.createrUsername = this.$store.getters.username
      // 拉取分页的数据
      this.getFlowTemplateByPage(1, 10)
    },
    methods: {
      // 创建流程模版
      showCreateFlowTemplateModal() {
        this.dialogFormVisible = true
      },
      // 分页查询用户信息～
      getFlowTemplateByPage(currentPage, limit, name) {
        var obj = {
          currentPage: currentPage,
          limit: limit,
          'name': this.inputSearch
        }
        doGetFlowTemplateByPage(obj).then(res => {
          // 格式化
          this.currentPageData = res.objData[0].CurrentPageData
          this.total = res.objData[0].Count
        }).catch(error => {
        })
      },
      handleDelete(){

      },
      // 发送请求, 拉取用户的信息
      handleEdit(index, row) {
        /*user.edit(row.id).then(res => {
          if (res.data.rolesDto==='ROLE_ADMIN'){
            res.data.rolesDto = '管理员'
          }
          this.form = res.data
          // 将数据填充到模态框中
          this.dialogFormVisible = true;
        }).catch(error => {})*/
      },
      handleCloseEdit() {
        this.dialogFormVisible = false
        this.from = []
      },
      // 添加或者是修改模版信息～
      handleDoEditOrCreate() {
        createOrUpdateFlowTemplate(this.form).then(res => {
          this.dialogFormVisible = false
          this.form = []
          // todo 拉去最新信息
          this.getFlowTemplateByPage(this.currentPage, this.pageSize)
        }).catch(error => {
        })
      },

      // 分页相关～
      handleSizeChange(val) {
        this.pageSize = val
        this.getFlowTemplateByPage(1, val)
      },
      handleCurrentChange(val) {
        this.getFlowTemplateByPage(val, this.pageSize)
      },
      doInputSearch() {
        if (this.inputSearch.trim() === '') {
          Message.warning('请输入用户账号再进行搜索')
          return
        }
        this.currentPage = 1
        this.getFlowTemplateByPage(this.currentPage, this.pageSize, this.inputSearch)
        this.inputSearch = ''
      }
    }
  }
</script>

<style>
  .myDiv {
    margin-top: 20px;
  }
</style>
