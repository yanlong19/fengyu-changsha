import { shallowMount } from "@vue/test-utils";
import { expect, test } from "vitest";
import SimpleTable from "../src/components/SimpleTable";

const columns = [{
  dataIndex:'name',
  title:'名称',
  width:280,
  isSort:true,
},{
  dataIndex:'price',
  title:'单价',
},{
  dataIndex:'num',
  title:'数量',
  isSort:true,
},{
  dataIndex:'count',
  title:'总价',
  isSort:true,
}]
const data=[
  {name: '测试数据1', price: 12.3, num: 10,count: 123},
  {name: '测试数据22', price: 12.3, num: 10,count: 13},
  {name: '测试数据33', price: 12.3, num: 11,count: 123},
  {name: '测试数33', price: 12.3, num: 10,count: 123},
  {name: '测试数据13', price: 12.3, num: 10,count: 3}
]

// 整体最基本的渲染
test("mount component", () => {
  const wrapper = shallowMount(SimpleTable, {
    props: {
      columns,
      dataSource: data
    },
  });
  expect(wrapper.html()).toMatchSnapshot();
});


// 简单的排序测试
test("sort component", async() => {
  const wrapper = shallowMount(SimpleTable, {
    props: {
      columns,
      dataSource: data
    },
  });
  await wrapper.find('.sort_span').trigger('click');
  console.log(wrapper.html())
  expect(wrapper.find('.sort_span').element.textContent).toBe('升序');
  expect(wrapper.html()).toMatchSnapshot();
});