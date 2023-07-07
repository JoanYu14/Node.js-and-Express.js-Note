// Cookies and Session

// dotenv套件可以將環境變量從.env文件加載到process.env物件裡面
require("dotenv").config(); // require dotenv套件後馬上.config()，dotenv套件

const express = require("express");
const app = express();

// 從cookie-parser中取得的值是一個function
const cookieParser = require("cookie-parser");

// 從express-session中取得的值是一個function
const session = require("express-session");

// 從connect-flash取得一個funcion(當作middleware)
const flash = require("connect-flash");

// 設定Cookie
// 我們要把取得cookieParser當作一個method中介軟體使用，他會把Request中的Cookies存到req.cookies物件裡面。沒有用這個中介軟體的話req.cookie會是undefined
// cookieParser()這個function內部提供一個參數。此參數為某個秘密String(我們這裡值皆設定為MYCOOKIE_SCRECT_KEY這個在.env檔案中的環境變數)。
app.use(cookieParser(process.env.MYCOOKIE_SCRECT_KEY));

// 設定Session
app.use(
  session({
    secret: process.env.MYSESSION_SCRECT_KEY, // 對session id做簽名用的secrect key
    resave: false, // 如果在上次到本次的HTTP request期間，從未修改過此session，就不會將此session重新保存回伺服器上的session存儲區，可以阻止race condition

    // 在request的整個生命週期內， session object都沒有被修改的話，那麼在請求結束時，這個session object 不會被儲存。
    // 如果這個設定為true的話，那這個Request不管被哪個Route接受，給的Response會把有session id的Cookie給客戶端
    // 如果為false的話，那這個就要往會更改session id的Session物件的route寄送Request，這個route給你的Response才會有包含session id的Cookie
    saveUninitialized: false,
    cookie: { secure: false }, // 因為這個伺服器是在localhost上面運行的，所以沒有http"s"，因此這裡設定為true的話會cookie不會被傳遞
  })
);

// 使用flash這個middleware，所有Request都會具有req.flash()。
app.use(flash());

// 在接收到一個沒有包含connect.sid的Cookie時就會
// 在伺服器創建一個session id
// 在伺服器內部創建一個獨特的session id，並且創建一個對應這個session id的Session物件，所以你就能看到req.session
// 這個request被下面任何一個會改變Session物件的資料的route接收，並且有給Response的話(因為saveUninitialized為flase)
// 就會把這個session id簽名後當作一個key為connect.sid的cookie的value寄回到客戶端
app.use((req, res, next) => {
  console.log("收到一個Request");
  console.log(req.session);
  next();
});

app.get("/", (req, res) => {
  req.flash("message", "歡迎您");
  return res.send("這是首頁，" + req.flash("message"));
});

// ===================================================================================================================
// 為客戶端設定Cookie與signed Cookie，如果要給的值是一個Number或物件(Array,Object)之類的，就要把要當成value的值轉成JSON String
// 如果用戶對localhost:3000/setCookie寄送一個GET Request，那我們就給這個客戶的瀏覽器設置一個cookie
app.get("/setCookie", (req, res) => {
  // res.cookie可以讓我們給客戶端的瀏覽器設定一個cookie，兩個singed cookie
  // cookie的儲存形式是key-value pair的方式

  res.cookie("noSignedCookie", "Hello"); // 沒簽名的cookie設置方式

  // { signed: true }會把Cookie做簽名(把秘密string與cookie value當作參數放進演算法(HMAC演算法)中算出一個值就是signed cookie)
  // 最後給Cookie key的值就是一個signed Cookie((HMAC值))
  res.cookie("name", "Joan", { signed: true });
  res.cookie("yourCookie", "Oreo", { signed: true });

  return res.send("已經設置Cookie");
});

// ===================================================================================================================
// 取得客戶端傳來未簽名的Cookies
// req.cookies裡面的是沒有被簽名的Cookies
app.get("/getNoSignCookies", (req, res) => {
  console.log(req.cookies); // { noSignedCookie: 'Hello' } noSignedCookie在設定時就沒有做簽名的動作
  let allCookies = "";
  let totalCookie = 1;

  // cookieNmae會依序帶入req.cookies物件的屬性的key
  for (let cookieName in req.cookies) {
    // 要在for in loop中取得物件的屬性的值的話只能用中括號[]
    allCookies += `Cookie${totalCookie}的名稱為${cookieName}值為${req.cookies[cookieName]}。`;
    totalCookie += 1;
  }
  return res.send(`所有未簽名的Cookies : ${allCookies}`);
});

// ===================================================================================================================
// 取得客戶端傳來簽名過的Cookies
// 簽名過的Cookie的key-value pair會被放到req.signedCookies物件中，並且value是還沒被簽名過的值
app.get("/SignedCookies", (req, res) => {
  console.log(req.signedCookies); // { yourCookie: 'Oreo', name: 'Joan' }
  let allCookies = "";
  let totalCookie = 1;

  // cookieNmae會依序帶入req.signedCookies物件的屬性的key
  for (let cookieName in req.signedCookies) {
    // 要在for in loop中取得物件的屬性的值的話只能用中括號[]
    allCookies += `Cookie${totalCookie}的名稱為${cookieName}值為${req.signedCookies[cookieName]}。`;
    totalCookie += 1;
  }
  return res.send(`簽名過的Cookies : ${allCookies}`);
});

// ===================================================================================================================
// Session
// 為session id對應的Session物件新增屬性，req.session可以看到這個Session物件
app.get("/setSessionData", (req, res) => {
  console.log(req.session); // 此時req.session的Session物件還沒有example屬性了
  // 為這個session id對應到的Session物件新稱example屬性
  req.session.example = "為這個session id對應的Session物件新增example屬性";
  console.log(req.session); // 此時req.session的Session物件已經有example屬性了
  return res.send(
    `在伺服器設置session資料，在瀏覽器設置一個value為簽名後的session id的Cookie`
  );
});

// ===================================================================================================================
// 用session模擬登入狀態
app.get("/login", (req, res) => {
  req.session.login = true;
  return res.send("為您的Session設定了login屬性為true，代表已登入");
});

app.get("/logout", (req, res) => {
  req.session.login = false;
  return res.send("為您的Session設定了login屬性為flase，代表已登出");
});

// isLogin是要用來驗證是否有登入的middleware，放在route中
const isLogin = function (req, res, next) {
  if (req.session.login) {
    // if (req.session.login==true的意思)
    next();
  } else if (req.session.login == true) {
    res.send("您已登出，請重新登入");
  } else if (!req.session.login) {
    // if (req.session.login==true判斷結果為false)
    res.send("你從未登入過，請登入");
  }
};

app.get("/secret1", isLogin, (req, res) => {
  res.send("秘密1 : 我好餓");
});

app.get("/secret2", isLogin, (req, res) => {
  res.send("秘密2 : 我好想睡覺");
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000");
});
