import { defineComponent, toRefs, computed, ref, ErrorCodes } from "vue";
import { type TableProps, tableProps, type PaginationInst } from "./types";
import { formatWidth } from '../utils/tableUtils';
import Pagination from './Pagination';
import useSort from '../hooks/useSort';
import './table.css'
export default defineComponent({
  name: "SimpleTable",
  props: tableProps,
  setup(props: TableProps, { attrs, emit, slots }) {
    // 创建props的响应式引用
    const { columns, dataSource, rowKey, pagination, filter, isDefaultSort, width } = toRefs(props);

    // 通过计算属性拿到对应的展示数据
    const beforeSortData = computed(() => {
      let data: any[];
      // 用来记录传入的表格数据的深拷贝附件
      try {
        // 添加主键字段,顺便拷贝一份数据出来,暂时不考虑超过二层引用类型导致的浅拷贝问题
        data = dataSource.value.map((row: any, index: number) => (
          {
            __id: rowKey?.value ? row[rowKey.value] : index,
            ...row
          }
        ));
      } catch (error: any) {
        data = [];
        console.log('数据源格式错误,请确保是一个JSON格式的数组', error.message)
      }

      // 调用过滤
      if (filter && filter.value) {
        data = data.filter(filter.value);
      }
      return data;
    })
    const { sort, showData, getSortText } = useSort(beforeSortData, isDefaultSort, emit)
    const tableWidth = computed(() => {
      return formatWidth(width?.value || '') || '100%'
    })
    return () => {
      return (
        <div>
          <table class="my_simple_table" cellspacing="0" style={{ width: tableWidth.value }}>
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
              {showData.value.map((rowData: any) => {
                return (
                  <tr key={rowData.__id}>
                    {(columns?.value || []).map(item => <td>{rowData[item.dataIndex]}</td>)}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {pagination && <Pagination {...pagination.value}></Pagination>}
        </div>
      );
    };
  },
});