import { PropType, ExtractPropTypes } from "vue";
interface ColumnsItem {
  dataIndex: string,
  title: string,
  width?: number | string,
  isSort?: boolean
}

interface Pagination {
  pageSize: number,
  pageNo: number,
  total: number,
  pageSizeOptions?: number[],
  pageChange?(pageSize: number, pageNo: number): void
}

export interface Sort {
  sortIndex: string,
  sortType: 'ASC' | 'DESC' | ''
}


interface ArrayFilterCallBack {
  (value?: any, index?: number, array?: any[]): any;
}

//  定义 Props
export const tableProps = {
  columns: {
    type: Array as PropType<ColumnsItem[]>,
    require: true,
  },
  dataSource: {
    type: Array,
    default: () => []
  },
  rowKey: {
    type: String,
    require: false
  },
  pagination: {
    type: Object as PropType<Pagination>,
    require: false
  },
  filter: {
    type: Function as PropType<ArrayFilterCallBack>,
    Request: false
  }
} as const;


export type TableProps = ExtractPropTypes<typeof tableProps>;
