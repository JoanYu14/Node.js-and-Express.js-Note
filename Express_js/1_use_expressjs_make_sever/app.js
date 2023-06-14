// Express.js : 是一個建立在Node.js上的框架(Framework)
// 以下就是使用Express來架設伺服器的寫法

// require "express"這個pckage，然後express會存入一個function(因為在express中設定exports就是一個function，所以就不是物件了)
const express = require("express");
// 執行express function後他會return一個object，我們把這個object存到app變數裡
const app = express();

// HTTP request有很多種類例如: GET, POST, PUT, DELETE(寫在header內)
// app.get(url,(request,response)=>{})
// 這個程式被執行時(瀏覽器輸入localhost:3000)，就會自動製作request object和response object分別傳入req與res內
// res.send是我們要送給用戶端甚麼訊息
app.get("/", (req, res) => {
  res.send("歡迎來到我的網頁");
});

// 瀏覽器輸入localhost:3000/page1
app.get("/page1", (req, res) => {
  res.send("這是頁面1");
});

// 瀏覽器輸入localhost:3000/page2
app.get("/page2", (req, res) => {
  res.send("這是頁面2");
});

// 瀏覽器輸入localhost:3000/myPage
// 就會回傳myPage.html這個檔案
app.get("/myPage", (req, res) => {
  // Node.js會把整個app.js中的程式碼都包進module wrapper這個express function中
  // 且參數有(exports, require, module, __filename(檔案名稱與路徑), __dirname(資料夾名稱與路徑)
  // 所以才可以使用__dirname
  res.sendFile(__dirname + "/myPage.html");
});

// app.listen(portNumber , callbackFn)
// 我們執行程式碼就會啟動這個伺服器，這個sever就會24小時不斷地去聆聽有沒有從各種地方來的請求
app.listen(3000, () => {
  console.log("伺服器正在port3000上執行"); // 我們只要在終端機輸入node app.js就會出現這行程式碼
});
