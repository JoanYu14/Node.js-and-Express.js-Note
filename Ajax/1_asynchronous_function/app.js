// asynchronous function(異步函式)
// setTimeout()
// setTimeout()設置一個計時器，一旦計時器時間到，該計時器就會執行一個函數或指定的一段代碼。
// 這是一個在window object裡的一個method，所以一定要在瀏覽器執行，因為window object是瀏覽器執行JS程式碼時製作的global object(全域物件)
// Node.js製作的global object不是window object，所以沒有setTimeout()

console.log("第一行程式碼");
// setTimeout是一個異步函式，所以他會在其他地方獨立執行，並不會影響到其他程式碼
setTimeout(() => {
  console.log("兩秒後才會出現");
}, 2000);
console.log("最後一行程式碼");

// JavaScipt中絕大多數function皆疏於synchronous function(同步函式)
