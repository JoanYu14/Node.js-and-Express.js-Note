// require_function0.js
// 如果我們想要require一個function就好，那就要把被require的module的exports直接設定為一個fucntion
// require因為會執行require_function1這個module(整個程式碼被module wrapper這個express function包著並且是IIFE)
// 執行完後還會return他的exports，因為在"require_function1"這個module設定過export=fn1，所以reqFn1就會存入fn1這個function
const reqFn1 = require("./require_function1");

// require_function1設定的exports不是物件而是一個function而已，所以直接call function就好
reqFn1(); // hello from require_dunction1
console.log(reqFn1);
