// require_function1.js
function fn1() {
  console.log("hello from require_dunction1");
}

// 設定require_function1的module物件內的exports物件直接變成fn1這個function，這樣他就不是一個物件了
// 別人在require "require_function1"這個module時，除了執行程式(因為被包在module wrapper這個exFn且IIFE)
// 還會return "require_function1"的exports，此時exports就是一個function而非物件了
module.exports = fn1;
