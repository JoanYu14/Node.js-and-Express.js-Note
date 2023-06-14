// 連結app1.js這個module
// 執行這個app2.js，console會出現這是app1.js文件和10，就是app1.js寫的程式碼。
// 還有執行let number=10;(app1.js的程式)，但因為它在被require的時候就被包進module wrapper裡面，所以app1.js裡面的程式碼會從global scope變成function scope
// require的功能就是讓我們可以連結到其他module的程式碼

require("./app1"); // app1裡所有東西都被包進module weapper這個函式裡了，app1裡所有東西都會變成function scope
// 在app1雖然有let number = 10，但因為被包進module weapper這個函式裡了，所以變成function scope variable，因此跟app2中定義的number不會有衝突
let number = 30; // global variable
console.log(number); // 會印出

// 我們明明沒有寫require，卻能使用require這個function，就是因為node.js的Module Wrapper這個函式裡面就有一個參數是require
// 而我們有用IIFE去執行程式碼，所以Moudle在這裡面當然可以使用require函式，所以require函式其實是Node.js提供給我們的
/*
function(exports, require(本身是一個function), module, __filename, __dirname){
    require("./app1");
    let number = 30; // global variable
    console.log(number);
}()
*/

// require("./app1")裡面的app1其實長這樣，被包進module wrapper中了，然後立即執行(IIFE)
/* 
(function(exports, require(本身是一個function), module, __filename, __dirname){
    let number = 10;  此時變成function scope variable了
    console.log("這是app1.js文件");
    console.log(number);
})()
*/

// 所以其實整個app2.js長這樣
/* require("./app1")裡面的app1其實長這樣，被包進module wrapper中了，然後立即執行(IIFE)
function(exports, require(本身是一個function), module, __filename, __dirname){
    
    (function(exports, require(本身是一個function), module, __filename, __dirname){
    let number = 10;  此時變成function scope variable了
    console.log("這是app1.js文件");
    console.log(number);
    })()
    
    let number = 30; // global variable
    console.log(number);
}()
*/
