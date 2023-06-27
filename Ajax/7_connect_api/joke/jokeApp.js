// 連結外部API
async function getJoke() {
  try {
    // 因為用了await關鍵字，所以getJoke的程式碼會停在這裡直到fetch()的promise物件變成fulfilled才會繼續往下(收到Response)，並且這個fetch函式會直接return promise物件的值(就是一個Response物件)
    let responseObj = await fetch(
      "https://v2.jokeapi.dev/joke/Programming?type=single"
    );
    // 因為用了await關鍵字，所以getJoke的程式碼會停在這裡直到.json()的promise物件變成fulfilled才會繼續(把response物件的content為JSON的內容解析JS可讀取的內容)，然後這個.json()會直接return這個解析後的內容(一個Object)
    let jokeObj = await responseObj.json();

    // 讓getJoke這個異步函式所return的promise物件的值為jokeObj中屬性為joke的值
    return jokeObj.joke;
  } catch (e) {
    // 如果try中任何函式變成rejected就會執行catch
    console.log(e);
  }
}

let button = document.querySelector("#addJoke");
let output = document.querySelector("#output");

// 對button監聽點擊事件，如果點擊了這個button就執行這個異步callbackFn
button.addEventListener("click", async () => {
  try {
    // 因為用了await關鍵字，所以這個異步函式會停在這裡等getJoke的promise物件變成fulfilled才會繼續，如果變成rejected就會直接執行catch的程式碼
    // 因為用了await關鍵字，所以getJoke()會直接return變成fulfilled狀態的promise物件的值(jokeObj.joke)而不是一整個promise物件。我們把這個值存到joke變數中
    let joke = await getJoke();
    output.innerHTML += `<h1>${joke}</h1>\n`; // 讓output裡面的HTML部分加上一個h1標籤，並且文字是joke的內容並換行
  } catch (e) {
    console.log(e);
  }
});
