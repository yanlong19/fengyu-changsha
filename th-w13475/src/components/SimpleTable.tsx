import { defineComponent, reactive, watch, toRefs, computed, ref  } from "vue";
import { type TableProps,type Sort, tableProps,type PaginationInst } from "./types";
import { formatWidth, compare } from '../utils/tableUtils';
import Pagination from './Pagination';
import useSort from './useSort';
import './table.css'
export default defineComponent({
  name: "SimpleTable",
  props: tableProps,
  setup(props: TableProps, { attrs, emit, slots }) {
    // 创建props的响应式引用
    const { columns, dataSource, rowKey, pagination, filter, isDefaultSort } = toRefs(props);
    
    // 通过计算属性拿到对应的展示数据
    const beforeSortData = computed(()=>{
      // 用来记录传入的表格数据的深拷贝附件
      let data:never[] = JSON.parse(JSON.stringify(dataSource.value));
      // 添加主键字段
      data.forEach((row: any,index: number) => {
        row.__id = rowKey?.value ? row[rowKey.value] : index
      });
      // 调用过滤
      if(filter && filter.value){
        data = data.filter(filter.value);
      }
      return data;
    })
    const {sort,showData,getSortText,sortObj} = useSort(beforeSortData,isDefaultSort,emit)
    const pageRef = ref<PaginationInst|null>(null);
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
            {(columns?.value||[]).map(item=> (
              <th key={item.dataIndex} class="table_head">
                  {item.title}
                  <div v-show={item.isSort} class="sort_span" onClick={()=>sort(item.dataIndex)}>
                    {getSortText(item.dataIndex)}
                  </div>
              </th>
            ))}
            </tr>
          </thead>
          <tbody>
            {showData.value.map((rowData: any)=>{
              return (
                <tr key={rowData.__id}>
                  {(columns?.value||[]).map(item=> <td>{rowData[item.dataIndex]}</td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
        {pagination && <Pagination {...pagination.value} ref={pageRef}></Pagination>}
      </div>
      );
    };
  },
});