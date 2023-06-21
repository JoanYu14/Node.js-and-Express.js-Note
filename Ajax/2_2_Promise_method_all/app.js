// Combining Multiple Promises(結合多個Promise)

// 以下三個fetch都會同時執行
const fetchPromise1 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json"
);
const fetchPromise2 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/not-found"
);
const fetchPromise3 = fetch(
  "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json"
);

// Promise.all()
// Promise這個Class(constructor)有一個名為.all()的staic method，它的參數會接收一個promise array(就是一個array中有很多個promise物件)，然後return一個promise。
// Promise.all()如果fulfilled的話，它return的promise物件的值就是一個responseArray，裡面就是promise array的異步函式執行得到的結果(fetch的執行結果就是response)
// 所以Promise.all().then()的.then裡面的callbackFn被執行時，裡面帶入的參數就是responseArray

// 會是一個pending狀態的promise物件，因為要等參數promise array中的每個promise的狀態都變成fulfilled或其中一個變成rejected，Promise.all()回傳的promise物件的狀態才會改變
console.log(Promise.all([fetchPromise1, fetchPromise2, fetchPromise3]));

// 所有Promise.all()的promiseArray參數裡的promise物件都變成fulfilled狀態時，Promise.all()所return的promise物件就會變成fulfilled狀態，就會執行.then的callbackFn
Promise.all([fetchPromise1, fetchPromise2, fetchPromise3])
  .then((responseArray) => {
    console.log(responseArray); // Array(3) [Response, Response, Response]
    responseArray.forEach((responseObj) => {
      // responseArray中第二個Respose物件的status屬性為404，代表return fetchPromise2這個promise物件的fetch函式的網址是有這個Server但沒這個route
      // 所以即使是404的response，但fetch是只要有server回應了response，那它return的promise就會變成fulfilled狀態
      console.log(responseObj.url, responseObj.status);
    });
  })
  .then((a) => {
    console.log(a);
  }); // a是undefined，因為上一個then的callbackFn並沒有return值，所以雖然上一個then有return一個promise物件，但這個物件沒有值可以帶入到參數a當中

// =======================================================================================================================================================
// Promise.all()的promiseArray參數中有promise物件變成rejected狀態的樣子

// fetchPromise5和fetchPromise6，return這兩個promise物件的異步函式fetch發出request的URL根本不存在個server，所以兩個都會變成rejected狀態
const fetchPromise4 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json"
);
const fetchPromise5 = fetch(
  "https://learning-area/javascript/apis/fetching-data/can-store/not-found"
);
const fetchPromise6 = fetch(
  "https://learning-area/javascript/oojs/json/superheroes.json"
);

// Promise.all()會先return一個pending狀態的promise物件，然後在其他地方等參數promiseArray裡面的promise物件都變成fulfilled或任一個變成rejected，所以我們把這個物件用rejPromise存起來
let rejPromise = Promise.all([fetchPromise4, fetchPromise5, fetchPromise6]);

// 因為promiseArray中的fetchPromise5與fetchPromise6的狀態會變成rejected，所以rejPromise的狀態也會變成rejected
// 所以會執行.catch()的callbackFn，並且callbackFn的參數e會帶入錯誤訊息，並且在fetchPromise5的狀態變成rejected時就執行
// 代表只要有其中一個變成Rejected，Promise.all() return的promise物件就會變成rejected，不用等到fetchPromise6的狀態也變成rejected才會執行
// 也就是說Promise.All()的參數promiseArray裡的promise物件只要有任一個變成rejected，那Promise.all()的promise物件就會變成rejected
// 而promiseArray裡的promise物件他們的異步函式可能有快有慢，反正只要先變成rejected就會執行catch，並且catch的callbackFn帶入的參數就是這個最先變成rejected的promise的錯誤訊息
rejPromise
  .then((responseArray) => {
    console.log(responseArray);
  })
  .catch((e) => {
    console.log(e); // 會印出TypeError: Failed to fetch
  });

// =======================================================================================================================================================
// Promise.any()
// 只要Promise.any()的參數promiseArray中的任一個promise變成fulfilled狀態，那Promise.any()所return的promise物件就會變成fulfilled狀態
// Promise.any()的promise物件的值就會是最先變成fulfilled狀態的那個promise物件的值(那個異步函式return的值)
// Promise.any()的參數promiseArray中的所有promise都變成rejected狀態，那Promise.any()所return的promise物件才會變成rejected狀態

// 5會是rejected，1,2都會是fulfilled
let anyPromise = Promise.any([fetchPromise5, fetchPromise1, fetchPromise2]);

// fetchPromise1先變成fulfilled
anyPromise
  .then((responseObj) => {
    console.log(responseObj); // Response {type: 'cors', url: 'https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json', redirected: false, status: 200, ok: true, …}
  })
  .catch((e) => console.log(e));
