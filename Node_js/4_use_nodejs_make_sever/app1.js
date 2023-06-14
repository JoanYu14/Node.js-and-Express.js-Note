// 要先拿到node.js內建的http這個module，存到http裡面
// http就是用來在客戶端與伺服器做訊息交換時用的協議
const http = require("http");

// 用http這個module裡面的createServer()這個method，它就會去建出一個網頁的伺服器
// 要給一個callbackFn，這個callbackFn有兩個參數(request,response)
// req代表http request，res代表http response
// 這個callbackFn被Node.js自動執行的時候就會創建request object到req裡面，request object就代表http request裡面的內容然後Node.js會自動把它做成一個物件
// 這個callbackFn被Node.js自動執行的時候就會創建response object到res裡面，response object就代表http response裡面的內容然後Node.js會自動把它做成一個物件
const sever = http.createServer((req, res) => {
  // 此時我們在終端機輸入node app.js啟動伺服器後，在瀏覽器輸入localhost:3000
  // 終端機就會出現request object，這個request object是一個IncomingMessage，裡面就有很多屬性
  // console.log(req);
  // console.log(req.headers); // header是requset object的一個屬性，本身也是一個物件
  // console.log(req.url) // 如果我們在瀏覽器輸入localhost:3000/myPage，那終端機就會印出/myPage，所以我們利用這個來決定我們要顯示給使用者的內容是甚麼

  // writeHead()就是我們要寫這個http response的Header
  // writeHead(status code(狀態代碼，200代表OK),{status message(就是我們要設定這個Header的內容)})
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  // res.write()是responsive object的一個method，我們就可以在裡面寫東西
  res.write("歡迎來到我的網頁"); // 如果我們沒有在response header的Content-Type屬性裡設定charset=utf-8，那encoding就是錯的，會出現亂碼
  // write()完要寫.end()代表我們要寫的東西到這邊就停了
  res.end();
  // 這個時候在瀏覽器輸入localhost:3000時就是發送一個http quest到這個sever，sever就會把這個http response回傳給瀏覽器，就會顯示歡迎來到我的網頁
});

// 我們啟動這個伺服器，這個sever就會24小時不斷地去聆聽有沒有從各種地方來的請求
// listen(port,callbackFn)
// 如果這個sever.listen開始執行的話要執行的事
sever.listen(3000, () => {
  console.log("伺服器正在port3000上執行"); // 我們只要在終端機輸入node app.js就會出現這行程式碼
});

// 此時我們在瀏覽器輸入localhost:3000，會發現它雖然在運行但不會有任何反應，因為我們沒有給任何response，所以他一直在等sever甚麼時候給response
