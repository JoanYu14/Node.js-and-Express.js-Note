// Event Loop(事件循環)
// 凡是需要等待結果或是請求外部資源的函式都會被放入Event Loop中。
// 如果遇到需要等待結果的函式的話(異步函式不一定絕對會需要等待結果，如果我們自己定義的可能裡面的callbackFn不需要等待)，就會放到他們所屬的Event Loop的Queue中。
// Event Loop中還有一個叫做Event Loops的東西，裡面都是macroTask Queue

// 1
console.log("start"); // 是同步函式，在掃描時就會被放入Call Stack中直接被執行，執行完後，才會往下繼續掃描。

// 2
process.nextTick(function () {
  // 是屬於Event Loop中nextTick Queue類別的函式，所以這個函式的的callbackFn會被放入nextTick Queue中
  console.log("nextTick1");
});

// 3
setTimeout(function () {
  // 是屬於Event Loop中Timers這個macroTask Queue的函式，所以這個函式的callbackFn會被入Timers中
  console.log("setTimeout");
}, 0);

// 4
// call the constructor function本身是一個同步函式
new Promise(function (resolve, reject) {
  console.log("promise");
  resolve("resolve"); // resolve("resolve")會return一個值為"resolve"的Promise物件
}).then(function (result) {
  // 5 .then的callbackFn中不需要等待結果的函式會被放到microTask Queue中
  console.log("promise then");

  // 6 .then的callbackFn中的需要等待結果的函式還是會被放到Event Loop的Queue中，不會在microTask Queue中
  //   setTimeout()是Time這個macroTask Queue中的函式，所以它的callbackFn會被放到macrroTask Queue中
  setTimeout(() => console.log("一秒"), 1000);
});

// 7
// 用IIFE去執行一個異步函式，IIFE本身是一個同步函式，異步函式只是他的callbackFn
// JS在掃描到IIFE時就會把這個IIFE放進callStack中，直到IIFE被執行完畢從callStack中取出後才會繼續下面的程式碼
// 所以這裡會印出async，並且這個異步函式結束後會return一個Promise物件出來(沒有值的promise物件，因為async function內並沒有return)
// 因為這個異步函式並不需要等待結果，沒有需要放到Event Loop中的callbackFn，所以會直接執行完再往下
(async function () {
  console.log("async");
})();

// 8
// 雖然a是異步函式，但它並不需要等待結果，不會被放到Event Loop中，所以會被放到callStack中立即執行再往下
let a = async function () {
  console.log("async_a");
};
a();

// 9
// setImmediate是check這個macroTask Queue中的函式，所以它的callbackFn會被check Queue中
setImmediate(function () {
  console.log("setImmediate");
});

// 10
// 是屬於Event Loop中nextTick Queue類別的函式，所以這個函式的的callbackFn會被放入nextTick Queue中
process.nextTick(function () {
  console.log("nextTick2");
});

// 11
// 這是一個同步函式，所以JS在掃描到這裡時會把這個函釋放到callStack中，執行完再從callStack中取出並往下掃描
console.log("end");
// 到此就是完全掃描完了，接下來就是要處理Event Loop中的Queue中函式

/*
start
promise
async
async_a
end

從這裡開始清空Event Loop中的Queue
-- nextTick Queue會最優先被清空 --
nextTick1
nextTick2
-- microTask Queue(.then的callbackFn中不需要等待結果的函式就是在這個Queue的)是第二優先被清空的 --
promise then

-- Event Loop"s"中的六種macroTask Queue(會一直循環，直到所有Queue中都沒東西，因為有些Queue中的callbackFn可能還沒得到結果或是還沒觸發) --
-- 每次循環都會照優先順序看，但如果優先順序高的Queue裡面的callbackFn還不能執行或還沒有結果的話，Event Loop也不會停在這裡，而是往下一個優先度的Queue，直到所有Queue都看過能清的也清了，才會進行下一次循環 --
-- 下一次循環時，可能上一個循環時Queue中沒被清空的callbackFn已經可以執行了，那就會執行，還不行的就會在下一次循環時再看，以此類推直到所有Queue都清空 --
setTimeout ==>>Time這個macroTask Queue是Event Loops中優先度最高的Queue
setImmediate ==>>Check這個macroTask Queue是Event Loops中優先度排第五的Queue
一秒 ==>>雖然這是Time這個macroTask Queue裡面的callbackFn，但因為Event Loop在第一次循環的時候，一秒還沒到，所以還不能被執行，所以Event Loop才會先執行Check Queue中的callbackFn
*/
