import { computed, Ref, unref, ref, watch, nextTick } from "vue";
import type { PageChange, InputChangeFn, SetPageFn, UsePaginationReturn } from "../components/types";
/**
 * 分页hook
 * 
 * @param  pageSizeOptions 接收分页大小的选项的数组
 * @param  total 总记录条数
 * @param  total 分页变化回调
*/
export default function (
    pageSizeOptions: Ref<number[]>,
    total: Ref<number>,
    pageChange: PageChange | undefined,
    propsPageNo: Ref<number | undefined> | undefined,
    propsPageSize: Ref<number | undefined> | undefined
): UsePaginationReturn {
    // 定义两个内置的响应式分页数据
    const __pageNo = ref(1);
    const __pageSize = ref(unref(pageSizeOptions)[0])
    // 如果父组件不传PageNo和PageSize或者传undefined,那么将不进行受控,返回内置的响应式分页数据
    const pageNo = computed(() => {
        return unref(propsPageNo) ?? __pageNo.value
    });
    const pageSize = computed(() => {
        return unref(propsPageSize) ?? __pageSize.value
    });
    const inputNum = ref('');
    // 计算总共页数
    const pageLength = computed(() => {
        return Math.max(1, Math.ceil(unref(total) / unref(pageSize)));
    })
    // 上一页
    const Prev = () => {
        if (unref(pageNo) === 1) {
            return;
        }
        // 防止出现意外情况,这里设置上一页小于1时,回到第一页
        __pageNo.value = Math.max(1, unref(pageNo) - 1)
    }
    // 下一页
    const next = () => {
        if (unref(pageNo) === unref(pageLength)) {
            return;
        }
        __pageNo.value = Math.min(unref(pageLength), unref(pageNo) + 1)
    }
    // 跳往指定页数
    const goTo: SetPageFn = num => {
        if (num < 1) {
            __pageNo.value = 1;
            return;
        }
        if (num > unref(pageLength)) {
            __pageNo.value = unref(pageLength);
            return;
        }
        __pageNo.value = num;
    }
    // 修改页码
    const setPageNo: SetPageFn = num => {
        __pageNo.value = num;
    }
    // 修改分页大小
    const setPageSize: SetPageFn = num => {
        __pageSize.value = num;
    }
    // 更改分页大小
    const pageSizeChange: InputChangeFn = (e) => {
        __pageSize.value = Number((e.target as HTMLSelectElement).value || 10)
    };
    // 修改输入框值
    const setInputNum: InputChangeFn = (e) => {
        inputNum.value = (e.target as HTMLSelectElement).value || '1'
    };
    // 检测内部的分页值变动
    watch(__pageNo, () => {
        pageChange && pageChange(unref(pageSize), unref(__pageNo));
        nextTick(() => {
            // 页面重新渲染后如果,内置的分页数据不等于真实的分页数据(分页数据受控但pageChange中没有更改传入的分页数据),
            // 那么将值重置回当前真实值
            __pageNo.value !== pageNo.value && (__pageNo.value = pageNo.value);
            __pageSize.value !== pageSize.value && (__pageSize.value = pageSize.value);
        })
    });
    const syncPageData = () => {
        // 页面重新渲染后如果,内置的分页数据不等于真实的分页数据(分页数据受控但pageChange中没有更改传入的分页数据),
        // 那么将值与当前真实值同步一下
        __pageNo.value !== pageNo.value && (__pageNo.value = pageNo.value);
        __pageSize.value !== pageSize.value && (__pageSize.value = pageSize.value);
    }
    watch(__pageSize, () => {
        pageChange && pageChange(unref(__pageSize), unref(pageNo));
        nextTick(syncPageData)
    });
    return {
        pageNo,
        pageSize,
        inputNum,
        pageLength,
        Prev,
        next,
        goTo,
        pageSizeChange,
        setPageNo,
        setPageSize,
        setInputNum
    }
} 