import { defineComponent, reactive, ref } from "vue";
import { type TableProps, tableProps } from "./types";

interface tableRow {
  id: number;
  name: string;
}
export default defineComponent({
  name: "SimpleTable",
  props: tableProps,
  setup(props: TableProps, { attrs, emit, slots }) {
    // 表头数据
    const columns = props.columns;
    // 表格数据
    let list = reactive({
      data: props.data?.splice(0, 10) ?? []
    })
    // 存储表格备份数据
    const backUpsList = JSON.parse(JSON.stringify(props.data));
    const type = ref(0);
    // 排序方法，type：0无序 1正序 2逆序
    const handleSort = (item: string) => {
      if (type.value === 2) {
        type.value = 0;
        list.data = backUpsList.slice((currentPage.value-1) * MAX_NUMBER.value, currentPage.value * MAX_NUMBER.value);
        return;
      }
      type.value++;
      list.data.sort(compare('id'));
    }
    // 排序
    const compare = (key: string) => {
      return function(a: any, b: any){
        return type.value === 1 ? a[key] - b[key] : b[key] - a[key];	
      }
    }

    // 表格样式
    const cell = {
      width: '200px'
    }

    //分页数据方法
    const pagelist = (curr: number, total: number) => {
      let list = [];
      if(total < 7) {
        for(var r = 1; r < total + 1; r++) {
          list.push(r);
        }
      } else {
        if(curr < 4) { 
          list = [1,2,3,4,'...',total];
        } else {
          if(curr > total - 3) {
            list = [1, '...', total-3,total-2,total-1,total];
          } else {
            list = [1,'...',curr-1, curr, curr+1,'...',total];
          }
        }
      }
      return list;
    }
    const MAX_NUMBER = ref(10);
    const total = Math.ceil(props.data?.length / MAX_NUMBER.value);
    const currentPage = ref(1);
    // 初始分页数据
    const pages = ref(pagelist(1, total));
    const jumpNumber = ref('');

    const pageCtrl = (n: number) => {
      if (n && !isNaN(n)) {
        currentPage.value = n;
        pages.value = pagelist(n, total);
        list.data = backUpsList.slice((n-1) * MAX_NUMBER.value, n * MAX_NUMBER.value);
      }
    }

    // 分页样式
    const pagination = {
        display: 'flex',
        listStyle:'none'
    };
    const liItem = {
      margin: '0 10px'
    };
    
    return () => {
      return (
        <div>
          <table border="1">
            <thead>
              <tr>
                  {
                    columns.map(item => {
                      return <th style={cell} onClick={handleSort.bind(this,item)}>
                        <span>{item}</span>
                        <span id="sort">{Number(type.value) === 0 ? ' 无序' : Number(type.value) === 1 ? ' 正序' : ' 倒序'}</span>
                      </th>
                    })
                  }
              </tr>
            </thead>
            <tbody>
              {
                list.data.map(item => {
                  return <tr>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                  </tr>
                })
              }
            </tbody>
          </table>
          <div>
            <ul style={pagination}>
                {
                    pages.value.map(item => {
                        return <li style={liItem} onClick={pageCtrl.bind(this, item)}>{item}</li>
                    })
                }
                <li style={liItem}>跳转至</li>
                <li style={liItem}>
                    <input type="text" v-model={jumpNumber.value} onKeydown={pageCtrl.bind(this, jumpNumber.value)} />
                </li>
            </ul>
          </div>
        </div>
      );
    };
  },
})
