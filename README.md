## 基于 Vue 实战 Excel 表格上传解析与导出

1. 创建项目

   ```shell
   npm install -g @vue/cli
   vue create xxx

   npm install less less-loader axios qs element-ui vue-router xlsx
   ```

2. 基本项目结构略

### 文件上传

```vue
<!-- element-ui upload 上传组件 -->
<template>
  <div class="buttonBox">
    <!--
            action: 必填参数，上传的地址
            :auto-upload: 在选取文件后立即进行上传
            :show-file-list: 是否显示已上传文件列表-->
    <el-upload
      action
      accept=".xlsx, .xls"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handle"
    >
      <el-button type="primary" slot="trigger">选取EXCEL文件</el-button>
    </el-upload>

    <el-button type="success" @click="submit">采集数据收集</el-button>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import { readFile, character } from './assets/lib/utils'
export default {
  data() {
    return {}
  },
  methods: {
    // 采集 EXCEL 数据
    async handle(ev) {
      let file = ev.raw // ev.raw 为上传的文件数据
      if (!file) return

      // 读取file中的数据
      let data = await readFile(file)
      let workbook = xlsx.read(data, { type: 'binary' })
      let worksheet = workbook.Sheets[workbook.SheetNames[0]]
      data = xlsx.utils.sheet_to_json(worksheet) // 将数据转换成JSON格式

      // 把读取出来的数据变为最后可以传递给服务器的数据 (姓名=>name 电话=>phone)
      let arr = []
      data.forEach(item => {
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
        arr.push(obj)
      })
    },
    // 提交数据给服务器
    submit() {}
  }
}
</script>
```

```js
/* util.js */

// 把文件按照二进制进行读取
export function readFile(file) {
  return new Promise(resolve => {
    let reader = new FileReader()
    reader.readAsBinaryString(file) // 把当前文件以二进制进行读取
    reader.onload = ev => {
      resolve(ev.target.result)
    }
  })
}

// 字段对应表
export let character = {
  name: {
    text: '姓名',
    type: 'string'
  },
  phone: {
    text: '电话',
    type: 'string'
  }
}

// 时间字符串格式化
export function formatTime(str, template) {
  let arr = str.match(/\d+/g).map(item => {
    return item.length < 2 ? '0' + item : item
  })
  template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒'
  return template.replace(/\{(\d+)\}/g, (_, group) => {
    return arr[group] || '00'
  })
}
```
