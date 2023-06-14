// 要先拿到node.js內建的http這個module，存到http裡面
// http就是用來在客戶端與伺服器做訊息交換時用的協議
const http = require("http");

// 拿到node.js內建的fs這個module，存到fs裡面
// fs就是file system，讓我們可以對檔案做事情，例如readFile()讀取檔案，就能讓我們response一個檔案給客戶端
const fs = require("fs");

// 用http這個module裡面的createServer()這個method，它就會去建出一個網頁的伺服器
// 要給一個callbackFn，這個callbackFn有兩個參數(request,response)
// req代表http request，res代表http response
// 這個callbackFn被Node.js自動執行的時候就會創建request object到req裡面，request object就代表http request裡面的內容然後Node.js會自動把它做成一個物件
// 這個callbackFn被Node.js自動執行的時候就會創建response object到res裡面，response object就代表http response裡面的內容然後Node.js會自動把它做成一個物件
const sever = http.createServer((req, res) => {
  // writeHead()就是我們要寫這個http response的Header，要寫在最前面
  // writeHead(status code(狀態代碼，200代表OK),{status message(就是我們要設定這個Header的內容)})
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  // 如果我們在瀏覽器輸入localhost:3000，就會出現歡迎來到我的網頁
  if (req.url == "/") {
    res.write("歡迎來到我的網頁");
    res.end();
  }
  // 如果我們在瀏覽器輸入localhost:3000/page2，就會出現這是頁面1
  else if (req.url == "/page1") {
    res.write("這是頁面1");
    res.end();
  }
  // 如果我們在瀏覽器輸入localhost:3000/page3，就會出現這是頁面2
  else if (req.url == "/page2") {
    res.write("這是頁面2");
    res.end();
  }
  // 如果我們在瀏覽器輸入localhost:3000/myPage，myPage.html的內容，如果沒有叫做myPage.html的檔案的話就會出現存取html檔案出錯
  else if (req.url == "/myPage") {
    // 用fs的readFile這個method去讀取myPage.html的內容，沒有出錯的話就會把內容傳入data中，如果出錯的話Node.js就會製作一個error obeject並傳入e裡面
    fs.readFile("./myPage.html", (e, data) => {
      // 如果讀取檔案有錯誤的話e就會被傳入error object，就會觸發這個if(e)
      if (e) {
        res.write("存取html檔案出錯");
        res.end();
      } else {
        res.write(data); // 如果讀取檔案沒有出錯的話e就不會有東西，所以就會執行else的程式
        res.end();
      }
    });
  }

  // 每個write()完就要寫.end()不能寫在最外面，因為我們讀取檔案需要時間，所以如果寫在最外面會發生res.end()執行在res.wirte()前面的錯誤
  // res.end();
});

// 我們啟動這個伺服器，這個sever就會24小時不斷地去聆聽有沒有從各種地方來的請求
// listen(port,callbackFn)
// 如果這個sever.listen開始執行的話要執行的事
sever.listen(3000, () => {
  console.log("伺服器正在port3000上執行"); // 我們只要在終端機輸入node app.js就會出現這行程式碼
});
