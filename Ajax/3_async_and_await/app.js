// async關鍵字
// 如果我們要製作一個asynchronous function(異步函式)的話只要在function declaration(函是宣告)前加上async這個關鍵字就好。

// await關鍵字
// 在一個異步函式中調用會return promise的函式(就是異步函式)前使用await關鍵字的話，程式碼就會停在這個地方直到異步函式promise變成fulfilled或rejected(就是這個異步函式執行結束)
// 但是加了await關鍵字的異步函式return的就不會是promise物件了，而是直接return異步函式的執行結果。就是不用在使用.then()的callbackFn的參數去取出promise的值了。而是可以直接使用
// await只能用在異步函式中!!

async function fetchProduct() {
  // 如果對異步函式中的所有異步函式都用await關鍵字的畫，我們甚至可以使用 try...catch進行錯誤處理，就像代碼是同步的一樣。
  // 用try..catch(e)就像我們用then..catch(e)一樣，對於這種寫法來說也是如果try中的某個異步函式發生rejected的狀況的話就會執行.catch的callbackFn。
  try {
    // 此時這fetchProduct這個異步函式的時間線中(在全域中所呼叫的異步函式自己都在屬於自己的時間線)，程式就會停留在這裡，直到fetch這個異步函式的promise物件變成fulfilled或rejected(也就是fetch執行結束)才會繼續
    // 但是執行後fetchResponse不會是一個Promise物件，而是一個Response物件，就是說return的直接就是異步函式fetch得到的結果了，就像是同步函式一樣
    // 所以只要加了await的話，這個異步函式就不會是return promise物件了，而是像同步函式一樣直接return值
    const fetchResponse = await fetch(
      "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json"
    );

    // 會印出一個Response物件(就是fetch這個異步函式得到的執行結果而不是一個promise物件了)
    // 因為有在fetch前面有使用await關鍵字，所以會等到fetchResponse變成fulfilled或rejected才會繼續執行這段程式碼
    // 如果fetch前面沒有加await的話，這裡就會顯示Promise {<pending>}，代表fetch還沒執行結束就執行這段程式碼了
    console.log(fetchResponse); // Response {type: 'cors', url: 'https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json', redirected: false, status: 200, ok: true, …}

    console.log(fetchResponse.status); // 200，因為有await關鍵字，所以fetch回傳的就直接是fetch得到的結果(Response物件)而非promise物件，所以我們可以直接使用，不用再用.then()

    // Response物件的.json()這個method也是異步函式，所以我們也可以在前面加上await，這樣他就會等到.json()把fetchResponse的content內容的JSON文件變成JS可以使用的內容並直接return出來存到data後
    // 這個異步函式的時間線才會繼續執行此異步函式中下面的程式碼
    const data = fetchResponse.json();
    // 因為data直接是.json()的執行結果而不是promise物件了，所以console.log(data)不會是Promise {<pending>}了
    // 也不用等promise物件變成fulfilled後使用.then()中的callbackFn的參數才能使用值了
    console.log(data); // Array (12) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}] ， 有12個物件的array
  } catch (e) {
    console.log(e);
  }
}

fetchProduct();

// =======================================================================================================================================================
// 關於promise物件的一些補充介紹
async function myFunction() {
  return 10;
}
let promiseObj = myFunction();

// 直接return很快，所以在執行這段程式碼時myFunction()這個異步函式已經執行完畢了，所以不是pending狀態的promise物件
// 這裡可以看到promiseObj仍然是一個promise物件，只是裡面有異步函式return的結果
console.log(promiseObj); // Promise {<fulfilled>: 10}

// 所以.then的callbackFn的參數帶入的值是從promiseObj這個promise物件中取出的
// 因此如果在myFunction()中沒有return10這行的話，那這個異步函式它return的promise物件就不會有值，因此data參數就沒有東西可以帶入，會是undefined
// 還有雖然這個異步函式是在後面才寫的，但因為它比較快完成，所以這段程式碼的結果會在fetchProduct()前先出現
promiseObj.then((data) => {
  console.log(data); // 10
});
