// Middleware(中介軟體)
// 從HTTP發出Resquest後，到sever寄出response前，用來做特定用途的程式。
// 每個Middleware可以針對收到的東西進行修改或解析。處理後再決定要不要繼續把東西傳遞下去。
const express = require("express");
const app = express();

// 在瀏覽器輸入localhost:3000的話會

// middlewares語法 : app.use(callbackFn)
// 這個callbackFn有三個基本的參數，1.req 2.res 3.next(是一個函式)
// next是一個function如果這個middleware沒有打算結束request也沒有要給response的話就要呼叫next函式把控制權傳遞下去

// 自行製作的use內部的callbackFn
app.use((req, res, next) => {
  console.log("正在經過第一個Middleware"); // 有HTTP Request(不管是哪種method的)都會經過，所以console會出現"正在經過第一個Middleware"
  next(); // 如果沒有呼叫next函式的話，因為這個middleware並沒有傳遞response(res.send)給客戶，所以request就會停滯(客戶端的瀏覽器會一直轉圈)
  // 呼叫了next函式後，這個request的東西的控制權就會被傳到下一個middleware了
});

app.use((req, res, next) => {
  console.log("正在經過第二個Middleware"); // Request經過上一個middleware後被傳遞到這個middleware，所以console會出現"正在經過第二個Middleware"
  next(); // 呼叫next函式後這個request的東西的控制權就會被傳下去，就會開始看有沒有處理相對應request的程式，沒有的話就會出現Cannot GET(request method) /客戶輸入的route
});

/* 如果我們要讓客戶登入後才能看的話，就可以寫一個這樣的middleware(只是簡單示範而已)
   假設req中有一個屬性authentciate是false的話代表沒登入，那就回傳一個"沒有登入無法進入網頁"的response給客戶端
   如果authentciate不是false的話就把控制權往下傳遞
app.use((req, res, next) => {
    req.authentciate == false{
        res.send("沒有登入無法進入網頁")
    }else{
        next()
    }
})
*/

// Express的built-in function
// 可以用Express內建的middleware的callbackFn放內app.use()內部
// 這兩個在上一章介紹過用途
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================================================================================================================================

// request控制權經過兩個middleware後被傳到這裡，所以我們會給出response(沒有res.send的話客戶request也是會停滯)
app.get("/", (req, res) => {
  res.send("歡迎來到網站首頁");
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000");
});
