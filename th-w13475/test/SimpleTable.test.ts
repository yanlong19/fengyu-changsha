import { shallowMount } from "@vue/test-utils";
import { expect, test, describe } from "vitest";
import SimpleTable from "../src/components/SimpleTable";

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
const data = [
  { name: '测试数据1', price: 12.3, num: 10, count: 123 },
  { name: '测试数据22', price: 12.3, num: 10, count: 13 },
  { name: '测试数据33', price: 12.3, num: 11, count: 123 },
  { name: '测试数33', price: 12.3, num: 10, count: 123 },
  { name: '测试数据13', price: 12.3, num: 10, count: 3 }
]
const getTestData = (sortIndex?: string, sortType?: string) => {
  const data = new Array(5).fill(null).map((item, index) => ({
    name: `排序测试_${sortIndex || ''}_${sortType || ''}_${index}`, price: parseInt(Math.random() * 10000 + '', 10) / 100, num: 10, count: 123,
  }))
  return data;
}

describe('base', () => {
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
  // 宽度
  test("width component", async () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {
        columns,
        dataSource: data,
        width: 600
      },
    });
    expect(wrapper.find('.my_simple_table').element.style.width).toBe('600px');
    await wrapper.setProps({ width: '700' })
    expect(wrapper.find('.my_simple_table').element.style.width).toBe('700px');
    await wrapper.setProps({ width: '800px' })
    expect(wrapper.find('.my_simple_table').element.style.width).toBe('800px');
  });
  // 过滤功能测试
  test("filter component", async () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {
        columns,
        dataSource: data,
        filter: (item) => {
          return item.num !== 11
        }
      },
    });
  });

  // 简单的排序测试
  // test("sort component", async () => {
  //   const wrapper = shallowMount(SimpleTable, {
  //     props: {
  //       columns,
  //       dataSource: data
  //     },
  //   });
  //   await wrapper.find('.sort_span').trigger('click');
  //   console.log(wrapper.html())
  //   expect(wrapper.find('.sort_span').element.textContent).toBe('升序');
  //   expect(wrapper.html()).toMatchSnapshot();
  // });
})





