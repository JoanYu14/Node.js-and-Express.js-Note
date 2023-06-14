// Module Wrapper
let number = 10; // global variable
console.log("這是app1.js文件");
console.log(number);

// 在背後運作的一些事情，是我們看不見的，其實程式碼是長這樣的
// 在我們執行這段程式碼之前，Node.js其實會使用函式包裝器來包裝它
// 我們的程式碼被包在一個Function Expression內，這個function就是Module Wrapper
// 並且會被立即執行，就是IIFE
/*
(function(exports, require(本身是一個function), module, __filename(檔案名稱與路徑), __dirname(資料夾名稱與路徑)){
    let number = 10;
    console.log("這是app1.js");
})()
*/

console.log(__dirname); // c:\Users\余瓊紋\Desktop\程式\後端\node_js\node_practise
console.log(__filename); // c:\Users\余瓊紋\Desktop\程式\後端\node_js\node_practise\app1.js
