<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import SimpleTable from "./components/SimpleTable";
import { reactive } from "vue";
const columns = [{
  dataIndex: 'name',
  title: '名称',
  width: 280,
  isSort: true,
}, {
  dataIndex: 'price',
  title: '单价',
}, {
  dataIndex: 'num',
  title: '数量',
  isSort: true,
}, {
  dataIndex: 'count',
  title: '总价',
  isSort: true,
}]
const table = reactive({
  data: [
    { name: '测试数据1', price: 12.3, num: 10, count: 123 },
    { name: '测试数据22', price: 12.3, num: 10, count: 13 },
    { name: '测试数据33', price: 12.3, num: 11, count: 123 },
    { name: '测试数33', price: 12.3, num: 10, count: 123 },
    { name: '测试数据13', price: 12.3, num: 10, count: 3 }
  ]
})

const pagination = reactive({
  pageSize: 10,
  pageNo: 1,
  total: 100,
  pageSizeOptions: [5, 10, 15, 20, 25],
  pageChange: (pageSize: number, pageNo: number): void => {
    console.log(`pageSize:${pageSize}-----pageNo:${pageNo}`)
    pagination.pageSize = pageSize;
    pagination.pageNo = pageNo;
    table.data = (new Array(pageSize).fill(null).map((_, index) => {
      const price = Math.floor(Math.random() * 10000) / 100;
      const num = Math.ceil(Math.random() * 10)
      return {
        name: `测试数据${pageNo}_${index}`,
        price,
        num,
        count: price * num
      }
    }))
    console.log(table.data)
  }
})

const filter = (item: any, num: number, arr: any[]) => {
  if (item.num < 5) {
    return false
  }
  return true
}

</script>

<template>
  <SimpleTable :columns="columns" :dataSource="table.data" :pagination="pagination" :filter="filter" />
</template>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px;
}
</style>
