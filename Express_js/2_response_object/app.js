const express = require("express");
const app = express();

// 1. send() : 傳送出HTTP Response，可以是Strin,object,boolean,number,HTML標籤...
//     只要我們使用了res.send(body)的話，HTTP的Header與content Express.js都會自動幫我們做好，就是Header的部分會自動幫我們填好，content的部分就是我們給的body
app.get("/", (req, res) => {
  res.send("歡迎來到網站首頁");
});

app.get("/element", (req, res) => {
  res.send("<h1>用send傳送出一個h1標籤(HTTP Response)</h1>"); //設定header

  // Cannot set headers after they are sent to the client
  // 我們在第10行就設定過header(res.send幫我們填了)，一個response只能設定一次header
  // res.send("<p>不能執行</p>");  又設定header，不能有兩個send
});

// =============================================================================================================================================================
// 2. res.sendFile(path) : 將位於path的文件寄出去，path要是絕對路徑

app.get("/example", (req, res) => {
  // Express.js是建構在Node.js上的framework(框架)，所以Node.js的功能express.js中都能做使用
  // Node.js會把整個app.js中的程式碼都包進module wrapper這個express function中
  // 且參數有(exports, require, module, __filename(檔案名稱與路徑), __dirname(資料夾名稱與路徑)
  // 所以才可以使用__dirname
  res.sendFile(__dirname + "/example.html");
});

// =============================================================================================================================================================
// 3. res.json(body) : 發送JSON response。此method會先使用JSON.stringify()將body轉換為JSON String後，再發送一個response給客戶端

app.get("/json", (req, res) => {
  let obj = {
    name: "Joan",
    age: 22,
  };
  res.json(obj);
});

// =============================================================================================================================================================
// 4. res.redirect(path) : 伺服器會發送狀態為302(status code，像OK就是200)的HTTP response要求客戶端到path，
//                         客戶端會重新發送一個HTTP GET request到path。

// (1) 客戶端對伺服器/page發出GET request
// (2) sever中處理/page的routing會回傳包含狀態302 Found和Location: /actualPage的Response給客戶端
// (3) 所以客戶端接受到response後就知道sever有找到這個東西，但是這個東西被移到/actualPage了，所以客戶端就會再對伺服器/actualPage發出GET Request
// (4) 此時下面處理/actualPage的routing就會傳送包含狀態為200 OK和actualPage.html的Response給客戶端
// 所以雖然在瀏覽器輸入localhost:3000/page會直接導到localhost:3000/actualPage，但其實發生了以上的4個事情
app.get("/page", (req, res) => {
  res.redirect("/actualPage"); // ""沒有填寫path的話會預設302 Found
});

app.get("/actualPage", (req, res) => {
  res.sendFile(__dirname + "/actualPage.html");
});

// =============================================================================================================================================================
// 處理亂打路由的問題(路由就是sever後面/...)
// 如果輸入localhost:3000/aaaaa會出現Cannot GET /aaaaa
// 因為sever沒有處理/aaaaa這個路由的routing
// "*"就代表所有可能的路由(除了這上面設定過的路由)，所以如果再次輸入localhost:3000/aaaaa，sever就會回傳這個response
// 因為程式碼是由上往下讀的，所以如果把"*"這個route放在最上面設定的話，那即使輸入有設定routing的路由也會出現"你所找的頁面不存在"。
// 所以要放在所有route的最下面，app.listen的上面
app.get("*", (req, res) => {
  res.send("你所找的頁面不存在");
});

// =============================================================================================================================================================

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000");
});
