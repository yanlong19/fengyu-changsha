import { defineComponent, toRefs, unref, Ref } from "vue";
import { type PaginationProps, pagination } from "./types";
import usePagination from '../hooks/usePagination';
import './table.css'
export default defineComponent({
    name: "Pagination",
    props: pagination,
    setup(props: PaginationProps, { attrs, emit, slots }) {

        const { total, pageSizeOptions, pageChange, pageNo: propsPageNo, pageSize: propsPageSize } = toRefs(props);
        const {
            pageNo,
            pageSize,
            inputNum,
            pageLength,
            Prev,
            next,
            goTo,
            pageSizeChange,
            setInputNum
        } = usePagination(pageSizeOptions, total, unref(pageChange), propsPageNo, propsPageSize);
        return () => (
            <div class="table_pagination">
                <span class="page_span" onClick={Prev}>上一页</span>
                {new Array(pageLength.value).fill(null).map((_, index) => (
                    <span class={`page_span ${(index + 1) === pageNo.value ? 'page_span_active' : ''}`} onClick={() => { goTo(index + 1) }} >
                        {index + 1}
                    </span>
                ))}
                <span class="page_span" onClick={next}>下一页</span>
                <select onChange={pageSizeChange} value={pageSize.value}>
                    {pageSizeOptions?.value?.map(item => (
                        <option value={item}>{item}</option>
                    ))}
                </select>
                <input value={inputNum.value} onChange={setInputNum}></input>
                <button onClick={() => goTo(Number(inputNum.value))}>跳转</button>
            </div>
        )
    }
})