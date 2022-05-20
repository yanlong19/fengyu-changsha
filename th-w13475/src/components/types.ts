import { PropType, ExtractPropTypes, type ComputedRef, type Ref } from "vue";

// 排序数据类型定义
export interface Sort {
  sortIndex: string,
  sortType: 'ASC' | 'DESC' | ''
}
// 排序hook返回参数类型定义
export interface UseSortReturn {
  sortObj: Sort,
  sort: (key: string) => void,
  showData: ComputedRef<any[]>,
  getSortText: (key: string) => void
}
// emit函数类型定义
export interface EmitType {
  (event: string, ...args: any[]): void
}

// 分页数据改变回调函数类型定义
export type PageChange = (pageSize: number, pageNo: number) => void;
export type InputChangeFn = (e: Event) => void;
export type SetPageFn = (num: number) => void;
export interface UsePaginationReturn {
  pageNo: Ref<number>,
  pageSize: Ref<number>,
  inputNum: Ref<string>,
  pageLength: ComputedRef<number>,
  Prev: () => void,
  next: () => void,
  goTo: SetPageFn,
  pageSizeChange: InputChangeFn,
  setPageNo: SetPageFn,
  setPageSize: SetPageFn,
  setInputNum: InputChangeFn
}
export const pagination = {
  defaultPageNo: Number,
  defaultPageSize: Number,
  total: {
    type: Number,
    default: 0
  },
  pageSizeOptions: {
    type: Array as PropType<number[]>,
    default: [10, 20, 40]
  },
  pageChange: {
    type: Function as PropType<PageChange>
  }
}
export type PaginationProps = ExtractPropTypes<typeof pagination>;
// 定义暴露出去的方法
export interface PaginationMethods {
  setPageNo: SetPageFn,
  setPageSize: SetPageFn,
}
// 定义所有暴露出去的属性
export type PaginationInst = Readonly<PaginationProps & PaginationMethods>

// 过滤方法签名定义
interface ArrayFilterCallBack {
  (value: any, index: number, array: any[]): any;
}

// 表格列数据类型定义
export interface ColumnsItem {
  dataIndex: string,
  title: string,
  width?: number | string,
  isSort?: boolean
}
// 表格分页数据类型定义
export interface Pagination {
  defaultPageNo?: number,
  defaultPageSize?: number,
  total: number,
  pageSizeOptions?: number[],
  pageChange?: PageChange
}
//  定义 Props
export const tableProps = {
  width: {
    type: Object as PropType<string | number>,
    require: false
  },
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
  },
  isDefaultSort: {
    type: Boolean,
    default: true
  }
} as const;
export type TableProps = ExtractPropTypes<typeof tableProps>;
// 定义暴露出去的属性
export interface TableProperty {
  pageRef: PaginationInst,
  sortObj: Sort
}
// 定义所有暴露出去的属性
export type TableInst = Readonly<TableProps & TableProperty>
