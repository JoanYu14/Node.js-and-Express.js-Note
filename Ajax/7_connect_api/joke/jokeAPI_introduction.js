// 連結jokeAPI

// fetch會先return一個狀態為pending的promise物件，然後對https://v2.jokeapi.dev/joke/Programming?type=single發出一個request，得到response後這個promise物件會變成fulfilled狀態
let result = fetch("https://v2.jokeapi.dev/joke/Programming?type=single");
result.then((responseObj) => {
  console.log(result); // 一個值為response物件的promise物件
  console.log(responseObj); // 一個response物件，此時還看不到message section的內容

  // response物件的.json()會return一個狀態為pending的promise物件，然後這個method會把response物件內的content的json文件解析為JS可讀取的內容
  // 當解析完後.json() return的promise物件就會變成fulfilled狀態，並且promise物件的值就是.json()解析得到的內容，所以.then的參數帶入的就是這個值
  responseObj.json().then((data) => {
    console.log(data); // 可得知這個JSON文件的內容就是一個object
    console.log(data.joke); // data這個object中有一個屬性為joke，joke的值就是笑話
  });
});
