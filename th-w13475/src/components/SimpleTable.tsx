import { defineComponent, reactive, watch, toRefs, computed, ref } from "vue";
import { type TableProps, tableProps, type Sort } from "./types";
import { formatWidth, compare } from '../utils/tableUtils';
import './table.css'
export default defineComponent({
  name: "SimpleTable",
  props: tableProps,
  setup(props: TableProps, { attrs, emit, slots }) {
    // 创建props的响应式引用
    const { columns, dataSource, rowKey, pagination, filter } = toRefs(props);

    // 创建表格数据,排序记录数据的响应式引用
    let { tableData, sortObj }: { tableData: any[], sortObj: Sort } = reactive({
      tableData: [],
      sortObj: {
        sortIndex: '',
        sortType: ''
      }
    });
    // 用来记录传入的表格数据的深拷贝附件,原于还原乱序用的
    let data: any[] = [];
    // 监听父组件的dataSource的变化,创建新的副本数据
    watch(dataSource, () => {
      console.log('dataSource', dataSource)
      data = JSON.parse(JSON.stringify(dataSource.value));
      if (filter && filter.value) {
        data = data.filter(filter.value);
      }
      data.forEach((row: any, index: number) => {
        row.__id = rowKey?.value ? row[rowKey.value] : index
      });
      tableData = [...(data as never[])];
    }, { immediate: true })

    // 根据列的dataIndex获取排序的状态
    const getSortText = (key: string): string => {
      let sortType = ''
      if (sortObj.sortIndex === key) {
        sortType = sortObj.sortType;
      }
      switch (sortType) {
        case 'ASC': return '升序';
        case 'DESC': return '降序';
        default: return '无序'
      }
    }

    // 排序的逻辑
    const sort = (key: string): void => {
      // 先确定此时排序的逻辑
      if (sortObj.sortIndex !== key) {
        sortObj.sortIndex = key;
        sortObj.sortType = 'ASC'
      } else if (sortObj.sortType === '') {
        sortObj.sortType = 'ASC'
      } else if (sortObj.sortType === 'ASC') {
        sortObj.sortType = 'DESC'
      } else {
        sortObj.sortType = ''
      }
      // 恢复无序
      if (!sortObj.sortType) {
        tableData = [...(data as never[])];
        return;
      }
      // 继续排序
      tableData.sort((a, b) => compare(a[key], b[key], sortObj.sortType))
    }

    const defaultPagination = {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      pageSizeOptions: [5, 10, 20],
      pageChange: undefined
    }
    // 分页的逻辑
    const { pageSize, pageNo, total, pageSizeOptions, pageChange } = toRefs(pagination?.value || defaultPagination);
    // 计算有多少页
    const pageLength = computed(() => {
      return Math.max(1, Math.ceil(total.value / pageSize.value));
    })
    // 触发分页跳转
    const pageJump = (pageSize: number, pageNo: number): void => {
      if (pageChange?.value) {
        pageChange.value(pageSize, pageNo);
      }
    }
    // 分页大小更改
    const pageSizeChange = (e: Event): void => {
      pageJump(Number((e?.target as HTMLSelectElement)?.value || ''), 1)
    }
    let toJumpPage = ref(1)
    return () => {
      return (
        <div>
          <table class="my_simple_table" cellspacing="0">
            {(columns?.value || []).map(item => {
              const { width, dataIndex } = item;
              const style = {
                width: formatWidth(width || '')
              }
              return <colgroup style={style} key={dataIndex}></colgroup>
            })}
            <thead>
              <tr>
                {(columns?.value || []).map(item => (
                  <th key={item.dataIndex} class="table_head">
                    {item.title}
                    <div v-show={item.isSort} class="sort_span" onClick={() => sort(item.dataIndex)}>
                      {getSortText(item.dataIndex)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData: any) => {
                return (
                  <tr key={rowData.__id}>
                    {(columns?.value || []).map(item => <td>{rowData[item.dataIndex]}</td>)}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {pagination && (
            <div class="table_pagination">
              <span
                class="page_span"
                onClick={() => { pageJump(pageSize.value, Math.max(1, pageNo.value - 1)) }}
              >
                上一页
              </span>
              {new Array(pageLength.value).fill(null).map((_, index) => (
                <span class={`page_span ${(index + 1) === pageNo.value ? 'page_span_active' : ''}`} onClick={() => { pageJump(pageSize.value, index + 1) }} >
                  {index + 1}
                </span>
              ))}
              <span
                class="page_span"
                onClick={() => { pageJump(pageSize.value, Math.min(pageLength.value, pageNo.value + 1)) }}
              >
                下一页
              </span>
              <select onChange={pageSizeChange}>
                {pageSizeOptions?.value?.map(item => (
                  <option value={item}>{item}</option>
                ))}
              </select>
              <input value={toJumpPage.value} onChange={e => { toJumpPage.value = Number((e?.target as HTMLInputElement)?.value) }}></input>
              <button onClick={() => pageJump(pageSize.value, toJumpPage.value)}>跳转</button>
            </div>
          )}
        </div>
      );
    };
  },
});