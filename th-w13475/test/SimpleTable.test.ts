import { shallowMount, mount } from "@vue/test-utils";
import { expect, test, describe } from "vitest";
import SimpleTable from "../src/components/SimpleTable";
import Pagination from '../src/components/Pagination';
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
const pagination = {
  total: 100,
  pageSizeOptions: [5, 10, 15, 20, 25]
}
const getTestData = (pageSize: number, pageNo: number) => {
  const data = new Array(pageSize).fill(null).map((item, index) => ({
    name: `排序测试_${pageSize || ''}_${pageNo || ''}_${index}`, price: parseInt(Math.random() * 10000 + '', 10) / 100, num: 10, count: 123,
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
    await wrapper.setProps({ width: '90%' })
    expect(wrapper.find('.my_simple_table').element.style.width).toBe('90%');
    await wrapper.setProps({ width: 'ss' })
    expect(wrapper.find('.my_simple_table').element.style.width).toBe('100%');
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
    const names = wrapper.findAll('tbody>tr').map(item => item.find('td').element.textContent);
    expect(names).not.contain('测试数据33');
  });
})

describe('columns', () => {
  // 列表项变更
  test("change component", async () => {
    const newColumn = {
      dataIndex: 'test',
      title: '新加的一项',
      width: 280,
    }
    const wrapper = shallowMount(SimpleTable, {
      props: {
        columns: [...columns, newColumn],
        dataSource: data,
      },
    });
    const columnElements = wrapper.findAll('thead>tr>th');
    expect(columnElements[4].element.textContent).toBe('新加的一项无序');
  });
})

describe("sort", () => {
  // 排序测试
  test("string sort", async () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {
        columns,
        dataSource: data
      },
    });
    await wrapper.find('.sort_span').trigger('click');
    expect(wrapper.find('.sort_span').element.textContent).toBe('升序');
    expect(wrapper.find('tbody').find('tr').find('td').element.textContent).toBe('测试数33');
  })
  test("num sort", async () => {
    const wrapper = shallowMount(SimpleTable, {
      props: {
        columns,
        dataSource: data
      },
    });
    await wrapper.findAll('.sort_span')[2].trigger('click');
    expect(wrapper.findAll('.sort_span')[2].element.textContent).toBe('升序');
    await wrapper.findAll('.sort_span')[2].trigger('click');
    expect(wrapper.findAll('.sort_span')[2].element.textContent).toBe('降序');
    expect(wrapper.find('tbody').find('tr').findAll('td')[2].element.textContent).toBe('11');
  })
})

// 分页相关功能测试
describe("pagination", () => {
  // 分页基础功能测试
  test("base", async () => {
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        dataSource: data,
        pagination
      },
    });
    const PaginationInst = wrapper.findComponent(Pagination);
    const pageButs = PaginationInst.findAll('.page_span');
    const length = Math.max(1, Math.ceil(pagination.total / pagination.pageSizeOptions[0]));
    // 测试分页页数是否正常
    expect(pageButs[length].element.textContent).toBe(`${length}`)
    // 测试分页大小是否正常
    expect(PaginationInst.find('select').element.value).toBe(`${pagination.pageSizeOptions[0]}`)
    // 测试页码是否正常
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('1')
  })
  // 分页不受控情况的跳转
  test("base change", async () => {
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        dataSource: data,
        pagination
      },
    });
    const PaginationInst = wrapper.findComponent(Pagination);
    const pageButs = PaginationInst.findAll('.page_span');
    const length = Math.max(1, Math.ceil(pagination.total / pagination.pageSizeOptions[0]));
    // 为第一页的时候点击上一页,应该还是第一页
    await pageButs[0].trigger('click');
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('1');
    // 点击下一页,此时应该是第二页
    await pageButs[length + 1].trigger('click');
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('2');
    // 跳转到第四页,
    await pageButs[4].trigger('click');
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('4');
    await PaginationInst.find('input').setValue('3');
    await PaginationInst.find('button').trigger('click');
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('3');
    await PaginationInst.find('input').setValue('-3');
    await PaginationInst.find('button').trigger('click');
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('1');
    await PaginationInst.find('input').setValue('99999');
    await PaginationInst.find('button').trigger('click');
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('20');
  })
  // 分页不受控情况的大小改变
  test("base change", async () => {
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        dataSource: data,
        pagination:{
          ...pagination,
          pageChange:(pageSize: number, pageNo: number)=>{
            expect(pageSize).toBe(20);
            wrapper.setProps({
              dataSource: getTestData(pageSize, pageNo)
            })
          }
        }
      },
    });
    const PaginationInst = wrapper.findComponent(Pagination);
    const pageSizeSelect = PaginationInst.find('select');
    await pageSizeSelect.findAll('option')[3].setSelected();
    expect(pageSizeSelect.element.value).toBe('20')
    expect(wrapper.find('tbody').findAll('tr').length).toBe(20)
  })

  // 分页数据受控情况下的跳转
  test("base change", async () => {
    const pageChange = async (pageSize: number, pageNo: number)=>{
      expect(pageSize).toBe(10);
      expect(pageNo).toBe(2);
      await wrapper.setProps({
        dataSource: getTestData(pageSize, pageNo),
        pagination:{
          ...pagination,
          pageChange,
          pageSize,
          pageNo
        }
      })
    }
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        dataSource: data,
        pagination:{
          ...pagination,
          pageChange,
          pageSize:10,
          pageNo:1
        }
      },
    });
    const PaginationInst = wrapper.findComponent(Pagination);
    const pageSizeSelect = PaginationInst.find('select');
    expect(pageSizeSelect.element.value).toBe('10')
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('1')
    const pageButs = PaginationInst.findAll('.page_span');
    expect(pageButs[pageButs.length-1].element.textContent).toBe('下一页')
    await pageButs[pageButs.length-1].trigger('click');
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('2')
  })
  // 分页数据受控情况下的跳转,点击非上一页,下一页的跳转
  test("base change", async () => {
    const pageChange = async (pageSize: number, pageNo: number)=>{
      expect(pageSize).toBe(10);
      expect(pageNo).toBe(3);
      await wrapper.setProps({
        dataSource: getTestData(pageSize, pageNo),
        pagination:{
          ...pagination,
          pageChange,
          pageSize,
          pageNo
        }
      })
    }
    const wrapper = mount(SimpleTable, {
      props: {
        columns,
        dataSource: data,
        pagination:{
          ...pagination,
          pageChange,
          pageSize:10,
          pageNo:1
        }
      },
    });
    const PaginationInst = wrapper.findComponent(Pagination);
    const pageSizeSelect = PaginationInst.find('select');
    expect(pageSizeSelect.element.value).toBe('10')
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('1')
    const pageButs = PaginationInst.findAll('.page_span');
    expect(pageButs[3].element.textContent).toBe('3')
    await pageButs[3].trigger('click');
    expect(PaginationInst.find('.page_span_active').element.textContent).toBe('3')
  })
})




