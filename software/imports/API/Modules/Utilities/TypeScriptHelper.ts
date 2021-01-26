export default class TypeScriptHelper {
    
    public static Inflate2DArray(newArr,totalRowC,totalColC,defaultValue)
    {
        for (let curRowC = 0; curRowC < totalRowC; curRowC++) {
            newArr.push([]);
            newArr[curRowC] = [];
            for (let curColC = 0; curColC < totalColC; curColC++) {
                newArr[curRowC].push(defaultValue);
            }
        }
        return newArr;
    }
  
}