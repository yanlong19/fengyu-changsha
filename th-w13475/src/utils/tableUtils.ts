const formatWidth = (width: string | number) : string => {
    let widthStr = String(width);
    if((/^[0-9]+px&/i).test(widthStr)){
        return widthStr;
    }
    if(Number.isNaN(Number(widthStr))){
        return '';
    }
    return `${widthStr}px`;
}

const compare = (a: string | number, b: string | number, type: string): number =>{
    // 如果是两个数字的比较,就直接比较就行
    if(typeof a === "number" && typeof b === "number"){
        return type === 'ASC' ? a - b : b - a;
    }
    // 先全部转成字符串再转成unicode编码再比较
    const aCode = String(a).split('').map(chart=> chart ? chart.charCodeAt(0) : 0)
    const bCode = String(b).split('').map(chart=> chart ? chart.charCodeAt(0) : 0)
    const maxLength = Math.max(aCode.length,bCode.length);
    for(let i=0; i<maxLength; i+=1){
        if(aCode[i] === bCode[i]){
            continue;
        }
        return type === 'ASC' ? (aCode[i] || 0) - (bCode[i] || 0) : (bCode[i] || 0) - (aCode[i] || 0)
    }
    return 1;
}

export {
    formatWidth,
    compare
}