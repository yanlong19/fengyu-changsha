import { computed,Ref,unref,ref,watch,onMounted  } from "vue";
import type {  PageChange,InputChangeFn,SetPageFn,UsePaginationReturn } from "./types";
/**
 * 分页hook
 * 
 * @param  pageSizeOptions 接收分页大小的选项的数组
 * @param  total 总记录条数
 * @param  total 分页变化回调
*/
export default function(
    pageSizeOptions:Ref<number[]>,
    total:Ref<number>,
    pageChange:PageChange|undefined,
    defaultPageNo:number|undefined,
    defaultPageSize:number|undefined
):UsePaginationReturn{
    const pageNo = ref(defaultPageNo||1);
    const pageSize = ref(defaultPageSize||unref(pageSizeOptions)[0]);
    const inputNum = ref('');
    // 计算总共页数
    const pageLength = computed(()=>{
        return Math.max(1, Math.ceil(unref(total) / unref(pageSize)));
    })
    // 上一页
    const Prev = ()=>{
        if(unref(pageNo) === 1){
            return;
        }
        // 防止出现意外情况,这里设置上一页小于1时,回到第一页
        pageNo.value = Math.max(1,unref(pageNo)-1)
    }
    // 下一页
    const next = ()=>{
        if(unref(pageNo) === unref(pageLength)){
            return;
        }
        pageNo.value = Math.min(unref(pageLength),unref(pageNo)+1)
    }
    // 跳往指定页数
    const goTo:SetPageFn = num =>{
        if(num < 1){
            pageNo.value = 1;
            return;
        }
        if(num>unref(pageLength)){
            pageNo.value = unref(pageLength);
            return;
        }
        pageNo.value = num;
    }
    // 修改页码
    const setPageNo:SetPageFn = num=>{
        pageNo.value = num;
    }
    // 修改分页大小
    const setPageSize:SetPageFn = num=>{
        pageSize.value = num;
    }
    // 更改分页大小
    const pageSizeChange:InputChangeFn = (e)=>{
        pageSize.value = Number((e.target as HTMLSelectElement).value||10)
    };
    // 修改输入框值
    const setInputNum:InputChangeFn = (e)=>{
        inputNum.value = (e.target as HTMLSelectElement).value|| '1'
    };
    watch([pageNo,pageSize],()=>{
        pageChange && pageChange(unref(pageSize),unref(pageNo))
    })
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