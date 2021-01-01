<template>
  <div class="uploadBox">
    <!-- 返回主页 -->
    <div class="homeBox">
      <router-link to="/">
        <el-tooltip content="返回列表页面" placement="top">
          <i class="el-icon-tickets"></i>
        </el-tooltip>
      </router-link>
    </div>

    <!-- 上传文件按钮 -->
    <div class="buttonBox">
      <el-upload
        action
        accept=".xlsx,.xls"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handle"
      >
        <el-button type="primary" slot="trigger">选取 Excel 文件</el-button>
      </el-upload>
      <el-button type="success" @click="submit">采集数据提交</el-button>
    </div>

    <!-- 解析出来的数据 -->
    <div class="tableBox" v-show="show">
      <h3>
        <i class="el-icon-info">
          小主，以下是采集完成的数据，请您检查无误后，点击“采集数据提交”按钮上传至服务器</i
        >
      </h3>
      <el-table :data="tempData" border style="width: 100%" :height="height">
        <el-table-column
          prop="name"
          label="姓名"
          min-width="50%"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          min-width="50%"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import { Loading } from 'element-ui'
import { readFile, character, delay } from '../assets/js/utils'
export default {
  name: 'Upload',
  data() {
    return {
      height: document.documentElement.clientHeight - 130,
      tempData: [],
      show: false
    }
  },
  methods: {
    // 采集 EXCEL 数据
    async handle(e) {
      let file = e.raw
      if (!file) return

      this.show = false
      let loading = Loading.service({
        text: '小主，请您稍等片刻，女家正在玩命处理中...',
        background: 'rgba(0,0,0,.5)'
      })

      await delay(300)

      // 读取FILE中的数据
      let data = await readFile(file)
      let workbook = xlsx.read(data, { type: 'binary' }),
        worksheet = workbook.Sheets[workbook.SheetNames[0]],
        list = xlsx.utils.sheet_to_json(worksheet)
      // console.log(list)

      // 把读取出来的数据变为可以提交为服务器的数据格式
      let arr = []
      let oldData = JSON.parse(window.localStorage.getItem('excel') || '[]')
      let index = oldData.length
      list.forEach(item => {
        let obj = {}
        for (let key in character) {
          if (!character.hasOwnProperty(key)) break
          let v = character[key],
            text = v.text,
            type = v.type
          v = item[text] || ''
          type === 'string' ? (v = String(v)) : null
          type === 'number' ? (v = Number(v)) : null
          obj[key] = v
        }
        obj.id = ++index
        obj.time = new Date()
        arr.push(obj)
      })

      await delay(300)

      // 展示到页面中
      this.show = true
      // console.log(arr)
      this.tempData = arr
      loading.close()
    },
    // 提交数据给服务器
    submit() {
      if (this.tempData.length <= 0) {
        return this.$message({
          message: '小主，请您先选择 EXCEL 文件！',
          type: 'warning',
          showClose: true
        })
      }
      let oldData = JSON.parse(window.localStorage.getItem('excel') || '[]'),
        newData = [...oldData, ...this.tempData]
      window.localStorage.setItem('excel', JSON.stringify(newData))
    }
  }
}
</script>

<style lang="less" scoped>
.homeBox {
  position: fixed;
  top: 10px;
  right: 20px;
  z-index: 9999;
  font-size: 40px;
}

.buttonBox {
  padding: 15px;
  display: flex;
  width: 35%;
  justify-content: flex-start;
  & .el-button {
    margin-right: 20px !important;
  }
}

.tableBox {
  padding: 0 15px;
  h3 {
    font-size: 18px;
    color: #f56c6c;
    padding-bottom: 15px;
  }
}
</style>
