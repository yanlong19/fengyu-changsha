import { reactive,computed,Ref,unref  } from "vue";
import type {  Sort,UseSortReturn,EmitType } from "./types";
import { compare } from '../utils/tableUtils';
/**
 * 排序hook
 * 
 * @param  beforeSortData 接收未排序前的列表数据
 * @param  isDefaultSort 是否使用组件内置排序功能
 * @param  emit 事件触发函数,用于触发自定义事件
*/
export default function(beforeSortData:Ref<any[]>,isDefaultSort:Ref<boolean>,emit:EmitType):UseSortReturn{
    // 定义排序数据
    const { sortObj } : {sortObj:Sort} = reactive({
        sortObj:{
          sortIndex:'',
          sortType:''
        }
    })

    // 排序点击处理
    const sort = (key:string) :void =>{
        // 先确定此时排序的逻辑
        if(sortObj.sortIndex !== key){
          sortObj.sortIndex = key;
          sortObj.sortType = 'ASC'
        } else if(sortObj.sortType === ''){
          sortObj.sortType = 'ASC'
        } else if(sortObj.sortType === 'ASC'){
          sortObj.sortType = 'DESC'
        } else{
          sortObj.sortType = ''
        }
        // 如果不调用默认排序逻辑的话就触发监听,交由父组件处理排序
        if(!unref(isDefaultSort)){
            emit("sortChange",sortObj.sortIndex,sortObj.sortType)
        }
    }

    // 计算排序后的展示数据
    const showData = computed(()=>{
        const copyData:[] = JSON.parse(JSON.stringify(unref(beforeSortData)));
        // 判断是否使用组件默认的排序逻辑
        if(unref(isDefaultSort) && sortObj.sortType){
          copyData.sort((a, b) => compare(a[sortObj.sortIndex], b[sortObj.sortIndex], sortObj.sortType))
        }
        return copyData
    })

    // 根据列的dataIndex获取排序的状态
    const getSortText = (key:string): string => {
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

    return {
        sortObj,
        sort,
        showData,
        getSortText
    }
} 