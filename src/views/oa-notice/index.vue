<template>
  <div style="padding: 30px">
    <el-row>
      <el-col :span="8">
        <el-button type="success" @click="showCreateFlowTemplateModal">新增公告</el-button>
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
          label="公告名称"
          width="130"
          prop="flowTemplateName">
        </el-table-column>
        <el-table-column
          label="创建者"
          width="130"
          prop="createrUsername">
        </el-table-column>
        <!-- <el-table-column
           label="创建时间"
           width="200"
           prop="createTime">
         </el-table-column>
         <el-table-column
           label="开始时间"
           width="200"
           prop="createTime">
         </el-table-column>
         <el-table-column
           label="截止时间"
           width="200"
           prop="createTime">
         </el-table-column>-->
        <el-table-column
          label="状态"
          width="130"
          prop="allApprove">
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
          align="left">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleGetDetail(scope.$index, scope.row)">查看详情
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
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

    <el-dialog title="添加公告" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-position="left">
        <el-form-item style="display:none" label="id" :label-width="formLabelWidth">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="创建者" :label-width="formLabelWidth">
          <el-input disabled v-model="form.createrUsername" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公告详情" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="describeContent"
            maxlength="50"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <!--todo  做文件上传～～～ -->
        <el-form-item label="接受者" :label-width="formLabelWidth">
          <el-radio v-model="radio" label="1">本部门</el-radio>
          <el-radio v-model="radio" label="2">全公司</el-radio>
        </el-form-item>
        <el-form-item label="起止时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
          </el-date-picker>
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
  import { createOrUpdateNotice } from '@/api/notice'
  import { Message } from 'element-ui'

  export default {
    name: 'complex-table',
    data() {
      return {
        value1: '', // 时间
        radio: '',
        radio: '',
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
        formLabelWidth: '120px',
        // 公告的详细信息
        describeContent: ''
      }
    },
    created() {
      this.form.createrUsername = this.$store.getters.username
      // 拉取分页的数据
      this.getFlowTemplateByPage(1, 10)
    },
    methods: {
      // 向后台发送请求～，拉去所有的报销模版信息
      showCreateFlowTemplateModal() {
        this.dialogFormVisible = true

        /* getAllFlowTemplateInfo().then((res) => {
           console.log(res)
           this.options = res.objData[0]
           this.dialogFormVisible = true
         }).catch(() => {
           this.dialogFormVisible = true
         })*/
      },
      // 分页查询用户信息～
      getFlowTemplateByPage(currentPage, limit, name) {
        var obj = {
          currentPage: currentPage,
          limit: limit,
          'name': this.inputSearch
        }
        /* doGetFlowTemplateByPage(obj).then(res => {
           // 格式化
           this.currentPageData = res.objData[0].CurrentPageData
           this.total = res.objData[0].Count
         }).catch(error => {
         })*/
      },
      // 查看流程详情
      handleGetDetail() {

      },
      handleDelete() {

      },
      handleCloseEdit() {
        this.dialogFormVisible = false
        this.from = []
      },
      // 添加或者是修改模版信息～
      handleDoEditOrCreate() {
        var obj = {
          createUser: this.$store.getters.username,
          content: this.describeContent,
          startTime: this.value1[0],
          endTime: this.value1[1],
          reciever: this.radio // 1:本部门 2:全公司
        }
        // 将请求发送到java中
        createOrUpdateNotice(obj,this.$store.getters.token).then(res => {
          this.dialogFormVisible = false
          this.form = []
          Message.success("公告发布成功～")
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
