<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import SimpleTable from "./components/SimpleTable";
import type { ColumnsItem, Pagination, TableInst } from './components/types'
import { reactive, toRefs, ref } from "vue";

const tableConfig = reactive<{ data: any[], columns: ColumnsItem[], pagination: Pagination }>({
  data: [],
  columns: [],
  pagination: {
    total: 100,
    pageSizeOptions: [5, 10, 15, 20, 25]
  }
})
tableConfig.data = [
  { name: '测试数据1', price: 12.3, num: 10, count: 123, test: '111' },
  { name: '测试数据22', price: 12.3, num: 10, count: 13, test: '111' },
  { name: '测试数据33', price: 12.3, num: 11, count: 123, test: '111' },
  { name: '测试数33', price: 12.3, num: 10, count: 123, test: '111' },
  { name: '测试数据13', price: 12.3, num: 10, count: 3, test: '111' }
]
tableConfig.columns = [{
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
}];


const { data, columns, pagination } = toRefs(tableConfig)
pagination.value.pageChange = (pageSize: number, pageNo: number): void => {
  tableConfig.data = new Array(pageSize).fill(null).map((item, index) => ({
    name: `测试数据_${pageNo}_${index}`, price: parseInt(Math.random() * 10000 + '', 10) / 100, num: 10, count: 123, test: '111',
  }))
}
const filter = (item: any, num: number, arr: any[]) => {
  if (item.num < 5) {
    return false
  }
  return true
}
const addColumns = () => {
  columns.value.push({
    dataIndex: 'test',
    title: '测试字段' + columns.value.length,
  })
}
const subtractColumns = () => {
  columns.value.pop()
}
const totalAdd = () => {
  pagination.value.total = pagination.value.total + 50
}
const totalsubtract = () => {
  pagination.value.total = pagination.value.total - 50
}
const paginationAdd = () => {
  pagination.value.pageSizeOptions?.push(pagination.value.pageSizeOptions[pagination.value.pageSizeOptions.length - 1] + 10)
}
const tableRef = ref<TableInst | null>(null)
const gotoPage = () => {
  tableRef.value?.pageRef.setPageNo(3)
}
const sortChange = (sortIndex: string, sortType: number): void => {
  tableConfig.data = new Array(5).fill(null).map((item, index) => ({
    name: `排序测试_${sortIndex}_${sortType}_${index}`, price: parseInt(Math.random() * 10000 + '', 10) / 100, num: 10, count: 123, test: '111',
  }))
}
</script>

<template>
  <div>
    <div>
      <button @click="addColumns">加一列</button>
      <button @click="subtractColumns">减一列</button>
      <button @click="totalAdd">total减50</button>
      <button @click="totalsubtract">total加50</button>
      <button @click="paginationAdd">pageSizeOptions加个选项</button>
      <button @click="gotoPage">外部控制调转到第三页</button>
    </div>
    <SimpleTable @sortChange="sortChange" :isDefaultSort="false" :columns="columns" :dataSource="data"
      :pagination="pagination" :filter="filter" ref="tableRef" />

  </div>
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
