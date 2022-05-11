<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import SimpleTable from "./components/SimpleTable";

// 表头数据
const columns = ['id', '名称']
// 表格数据
let list = Array.from({length: 165}, () => {
  const num = parseInt(100 * Math.random());
  return {
    id: num,
    name: '人物'+ num
  }
});
</script>

<template>
  <SimpleTable :data="list" :columns="columns" />
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
