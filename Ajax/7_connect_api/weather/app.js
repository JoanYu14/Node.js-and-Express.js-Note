// 連結OpenWeather
// 需要一個API Key才能從OpenWeather的伺服器取得服務或資料
// 如果沒有API Key的話，對伺服器發送Request會得到狀態為401 Unauthorized(未經授權)的Response
let myKey = "71ae1363048ae89581d471d8a8d660b5";

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// 定義一個名為getWeather的異步函式
// lat是緯度，lon是經度，myKey是API Key
async function getWeather(cityName) {
  // 因為getWeather這個異步函式內部的所有異步函式都有用await，所以可以用try catch寫法，如果沒有await就要用.then .catch寫法
  try {
    // 因為用了await關鍵字，所以getWeather的程式碼會停在這裡直到fetch()的promise物件變成fulfilled才會繼續往下(收到Response)，並且這個fetch函式會直接return promise物件的值(就是一個Response物件)
    let responseObj = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${myKey}`
    );
    console.log(responseObj); // 一個Response物件

    // 因為用了await關鍵字，所以getWeather的程式碼會停在這裡直到.json()的promise物件變成fulfilled才會繼續(把response物件的content為JSON的內容解析JS可讀取的內容)，然後這個.json()會直接return這個解析後的內容(一個Object)
    let data = await responseObj.json();
    console.log(data); // 一個物件，裡面會有所輸入的城市的天氣資料

    // 每次執行到這行output這個document element的HTML都會完全改變一次(因為是用=)
    // data物件內的coord屬性(一個物件)有名為lon與lat的屬性，他們的值分別為經度與緯度
    output.innerHTML = `<p>您查詢的城市名稱為:${cityName}，該城市的經度為:${data.coord.lon}，緯度為:${data.coord.lat}</p>`;

    // data物件內的weather屬性是一個陣列，他的第一個元素(index為0)是一個物件，這個物件內的main屬性裡面的值就是天氣(rain,cloud...)
    // 這裡的output.innerHTML是用+=，所以不會清掉output這個document element中之前的內容
    output.innerHTML += `<p>天氣為:${data.weather[0].main}</p>`;
  } catch (e) {
    // 如果try中的任何一個函式出現錯誤就會執行catch，並且參數e為錯誤訊息
    // Cannot read properties of undefined (reading 'lon') at getWeather，代表是在output.innerHTML那邊才出錯
    // 因為即使我們的城市名稱打錯，OpenWeather的伺服器還是會回傳一個狀態為404 notFound的Response，所以fetch的promise物件還是會變成fulfilled
    // 並且這個Response的content(message section)內還是有一個JSON文件，所以.json也是會變成fulfilled，解析後會發現裡面有一個object，物件內有cod屬性值為404，message屬性值為"city not found"
    // 因此直到output.innerHTML這行的data.coord.lon才出錯，因為data裡面沒有coor屬性自然也沒有lon屬性
    console.log(e);
    output.innerHTML = `您輸入的城市名稱有誤`;
  }
}

let city = document.querySelector("#city-name");
let button = document.querySelector("#search");
let output = document.querySelector("#weather");

button.addEventListener("click", () => {
  // 在city這個document element(input標籤)的值會作為引數被傳入getWeather裡面取代cityName參數
  getWeather(city.value);
});
