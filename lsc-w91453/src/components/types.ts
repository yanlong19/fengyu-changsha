import { ExtractPropTypes } from "vue";

//  定义 Props
export const tableProps = {
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
} as const;

export type TableProps = ExtractPropTypes<typeof tableProps>;

export type PagesProps = {
  currentIndex: number;
  total: number;
}
