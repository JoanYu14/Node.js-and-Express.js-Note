// Promise物件
// 在JS中，任何asynchronous function(異步函式) return的值都是Promise物件
// 我們會先得到一個狀態為pending的promise物件，那這個promise物件的狀態會隨著asynchronous function(異步函式)結束之後
// promis物件的狀態就會跟著改變(fulfilled實現或rejected拒絕)
let fetchPromise = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json"
);
// fetch是window object的一個method，也是一個異步函式，使用fetch函式能讓我們在JS程式碼內向URL發出HTTP Request
// fetch開始執行時就會return一個狀態為pending(擱置)的Promise物件，我們把這個Promise物件存進fetchPromise變數中
// 直到fetch這個異步函式執行結束(獲得一個HTTP Response或者操作失敗例如沒網路中斷)，Promise物件的狀態就會自變成fulfilled或rejected。

// =======================================================================================================================================================

// 會是一個pending狀態的Promise物件，因為從發出request到獲得Response其實需要一點時間，但fetch是一個異步函式且一開始執行就會return Promise物件出來了
// 所以fetch還在其他地方執行，不會影響這裡其他程式碼的運行，也就是說我們不用等到fetch執行結束才會執行這段程式碼
// 所以當我們執行這段程式碼時fetch還沒收到Response，所以fetch還沒結束，異步函式還沒結束的話，它回傳Promise物件的狀態就會是pending。
console.log(fetchPromise); // Promise {<pending>}

// =======================================================================================================================================================
// .then(onFulfilled[, onRejected]);是Promise物件的一個method
// 裡面一定要放一個onFulfilled參數，onRejected參數可放可不放
// 裡面的onFulfilled參數是一個callbackFn，會在Promise物件的狀態變成fulfilled(實現)時才被執行
// 裡面的onRejected參數是一個callbackFn，會在Promise物件的狀態變成rejected(拒絕)時才被執行
// 當異步函式執行執行結束時(這個例子是當fetch收到response時這個函式就是成功執行結束)，Promise物件要變成fulfilled狀態
// 裡面的callbackFn可以放物一個參數，這個參數就會帶入異步函式得到的結果(這個例子中，異步函式fetch得到的結果就是response)

// 當fetch函式成功執行結束(收到response)時，fetchPromise這個promise物件的狀態就會變成fulfilled，然後就執行.then裡面的callbackFn
// 我們的callbackFn是放一個arrow express function，這個arrow express function裡面有一個名為responseObj的參數，就會帶入fetch獲得的response
fetchPromise.then((responseObj) => {
  console.log(fetchPromise); // Promise {<fulfilled>: Response}，因為.then一定是Promise物件為fulfilled狀態時才會執行的，所以這個時候fetchPromise就會是一個狀態為fulfilled的Promise物件
  console.log(responseObj); // Response {type: 'cors', url: 'https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json', redirected: false, status: 200, ok: true, …}
});

// =======================================================================================================================================================
// Promise物件串接

// response物件有一個叫做.json的method
// .json()也是一個異步函式，所以此method會先return一個狀態為pendinh的Promise物件。它會讀取Response Object直到完成。該Promise以將body text解析為 JSON。
// 所以，我們使用.json()就可以將fetch(URL)所回傳的Response Object內部的文本資料取出。
// 將Response Object內部(content部分)的文本資料(JSON文件)將作為輸入，並對其進行解析以生成JavaScript可以使用的結果(array,number,...)。
// JavaScipt是無法直接讀取JSON資料的，所以我們在剛剛的response物件內無法直接看到content，要再用.json解析成JavaScript可用的內容

fetchPromise.then((responseObj) => {
  // .json是一個異步函式，所以他會return狀態為pending的Promise的物件
  // 當這個promise物件的狀態變成fulfilled時就執行.then裡的callbackFn
  // 此時callbackFn內的參數就帶入.json這個異步函式執行結束得到的結果(responseObj內的content部分由JSON文本轉為JavaScript可用的內容)
  responseObj.json().then((data) => {
    console.log(data); // 火狐瀏覽器 Array(12) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
  });
});

// 避免callback hell的寫法，下面兩種寫法的執行結果都與上面那個寫法相同

// 1.
// 讓fetchPromise.then這個method回傳responseObj.json()這個Promise物件，所以可以在這個.then後面直接.then
// 也就是responseObj.json()的.json回傳的Promise物件再繼續做.then，此時data帶入的就是.json執行完的結果
// 可以看到後面的那個.then的callbackFn的參數套用的是前面那個.then的callbackFn所回傳的東西(responseObj.json()的執行結果)
// 也就是說.then的callbackFn的參數套用的是這個Promise物件的異步函式的執行結果
// 後面執行.then的Promise物件是由前面那個.then所return的Promise物件
// 要注意的是不管我們在異步函式內return的是甚麼，他都只會是異步函式return的Promise物件內的值
// 所以我們想要用這個值的話，在下一個then的callbackFn內一定要有參數，那Promise物件內的值就會自動被帶入到參數內
fetchPromise
  .then((responseObj) => {
    // .then也會return一個promise物件，return responseObj.json();就代表這個.then所return的promise物件的值為responseObj.json()的執行結果，那下面那個.then的callbackFn的data參數就會帶入這個值
    // 如果我這裡寫return 5的話，就代表這個.then所return的promise物件的值為5，那下面那個.then的callbackFn的data參數就會帶入5
    return responseObj.json();
  })
  .then((data) => {
    console.log(data);
  });

// 2.
// 跟上面相同，只是把arrow express function的{return responseObj.json()}改成responseObj.json()
// 因為arrow express function如果直接這樣寫的話，沒有加{}括號且值有一行程式碼，它就會自動return那行程式碼的執行結果
fetchPromise
  .then((responseObj) => responseObj.json())
  .then((data) => {
    console.log(data);
  });

// =======================================================================================================================================================
// .catch()
// 是Promise物件的一個method
// 當Promise物件變成rejected狀態(return這個Promise物件的異步函式執行失敗)時，就會調用.catch((e)⇒{…})的callbackFn，這個callbackFn的參數會帶入錯誤訊息。
// 如果將 catch() 添加到 Promise Chain的末尾，那麼當任何異步函數調用失敗(裡面的任何一個Promise變成rejected狀態)時都會調用它。

// 根本沒有這個網址
let rejFetchPromise = fetch("http://fetching-data/can-store/products.json");

// 因為根本沒有那個URL所要找的server，所以fetch會失敗(Promise變成rejected狀態)
// 連server也沒有所以不會有任何response，如果是有這個server但沒有後面的route的話這個server會回傳404 Not Found的response
// rejFetchPromise是一個Promise物件，.then((reponse)....)也是一個Promise，.then((data)...)也是一個Promise
// 無論是三個Promise中的哪個變成rejected，都會調用後面的.catch裡面的callbackFn
rejFetchPromise
  .then((responseObj) => responseObj.json()) // 如果是這個異步函式才失敗的話一樣會調用後面的.catch裡面的callbackFn
  .then((data) => {
    // 如果是這裡失敗的話也會調用.catch
    console.log(data);
  })
  .catch((e) => {
    // e帶入的是錯誤訊息
    console.log(rejFetchPromise); // Promise {<rejected>: TypeError: Failed to fetch，因為rejFetch這個異步函式執行失敗了
    console.log("錯誤");
    console.log(e); // TypeError: Failed to fetch
  });
