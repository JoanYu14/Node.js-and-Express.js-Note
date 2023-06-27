// 製作自己的API，API中的function會return pending狀態的promise object

// Promise
// JavaScript中有一個名為Promise的constructor function(Class)，使用它就可以製作一個promise物件
// 呼叫Promise這個constructor function接受一個參數，此參數是一個函式，我們通常稱這個函式為executor
// executor裡面又有兩個參數，通常稱為1.resolve 2.reject，JS會自動把兩個函是帶入這兩個參數
// 當我們在executor中呼叫resolve這個函式(executor的參數)，就可以在裡面放一個參數，這個參數是一個值(可以是任何data type)，呼叫resolve這個新製作的promise物件就會變成fulfilled狀態，並且promise物件的值就為resolve的參數
// 當我們在executor中呼叫reject這個函式(executor的參數)，就可以在裡面放一個參數，這個參數是一個值(可以是任何data type)，呼叫resolve這個新製作的promise物件就會變成reject狀態，並且promise物件的值就為reject的參數
// 在executor中呼叫resolve或reject前，這個新promise物件都會是pending狀態的
// excutor中呼叫resolve是讓用Promise這個constructor製作的promise物件變成fulfilled，在外面直接使用Promise.resolve(value)則是直接return一個狀態為fulfilled，值為value的promise物件

let name = document.querySelector("#name");
let delay = document.querySelector("#delay");
let button = document.querySelector("#set-alarm");
let output = document.querySelector("#output");

// Promise Based API
// 如果要使用alarm這個function的人就要給兩個值，如果給的delayValue>=0就會成功，如果給的delayValue<0就會失敗

// 定義名為alarm的function，此function有兩個參數nameValue與delayValue，並且會return一個pending狀態的promise物件
function alarm(nameValue, delayValue) {
  // 此函式會return一個promise物件
  return new Promise((resolve, reject) => {
    // 如果delayValue小於0的話，alarm這個函式return的promise物件就會變成rejected狀態，並且promise物件的值就是"dealy不能小於0"
    if (delayValue < 0) {
      // 呼叫excutor的reject參數(函式)，會使這個新製作的promise物件由pending變成reject狀態
      reject("dealy不能小於0");
    } else {
      // 如果delayValue大於0的話，就呼叫setTimeout函式，參數1是一個callbackFn，參數2是毫秒，也就是在delayValue毫秒後，執行callbackFn
      setTimeout(() => {
        // 在delayValue毫秒後，呼叫excutor的resolve參數(函式)，會使這個新製作的promise物件由pending變成fulfilled狀態，並且promise物件的值為`${nameValue}起床!!!`
        resolve(`${nameValue}起床!!!`);
      }, delayValue);
    }
  });
}

// 對button監聽點擊事件，並且callbackFn為異步函式
button.addEventListener("click", async () => {
  try {
    // 因為用了await關鍵字，所以這個異步函式就會停在這裡直到alarm的promise物件變成fulfilled或rejected
    // 如果是fulfilled的話，alarm就會return promise物件的值(excutor中呼叫resolve時帶入的參數)，把這個值存進result變數中
    let result = await alarm(name.value, delay.value);
    // 讓output.innerHTML = result
    output.innerHTML = result;
  } catch (e) {
    // 如果alarm的promise物件變成rejected的話，就會執行catch函式，promise物件的值(excutor中呼叫reject時帶入的參數)就會帶入到catch函式的參數e中
    // 讓output.innerHTML = e
    output.innerHTML = e;
  }
});
