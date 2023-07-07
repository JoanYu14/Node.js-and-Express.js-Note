// 製作一個登入系統(Request我是用Postman寄出的)
// 使用bcrypt套件來對密碼做bcrypt雜湊函式後在存入MongoDB的exampleDB的users這個collection中
// bcrypt套件會自動幫我們隨機設定鹽巴。

// dotenv套件可以將環境變量從.env文件加載到process.env物件裡面
require("dotenv").config(); // require dotenv套件後馬上.config()，dotenv套件

const express = require("express");
const mongoose = require("mongoose");
const app = express();
// 在mongooseModel資料夾的users.js這個檔案內已經設定好User這個model，並設定module.exports = User，所以require("./mongooseModel/users") return就是User這個modle
const User = require("./mongooseModel/users");

// 從cookie-parser中取得的值是一個function
const cookieParser = require("cookie-parser");
// 從express-session中取得的值是一個function
const session = require("express-session");

// 從bcrypt取得的是一個物件
const bcrypt = require("bcrypt");

const saltRound = 12; // 設定做bcrypt雜湊函式的salt round為12，此數值越大雜湊運算需要的時間就越久，8,10,12,14比較常見

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

// express.json()會去檢查requests的header有沒有Content-Type: application/json。如果有，就把text-based JSON換成JavaScript能夠存取的JSON物件，然後放入req.body。
app.use(express.json());
// express.urlencoded()會去檢查requests的header有沒有Content-Type: application/x-www-form-urlencoded （也就是去檢查是不是帶有資料的POST、PUT、PATCH）
// 如果有，也把text-based JSON換成JavaScript能夠存取的JSON物件然後放入req.body。
app.use(express.urlencoded({ extended: true }));

// 定義一個名為isLogin的middleware，要放在下面的一個route中
let isLogin = (req, res, next) => {
  if (req.session.login) {
    // 如果寄送Request來的客戶端的存有session id的Cookie的值所對應到的在server內的Session物件的login屬性的值為true的話
    // 就讓route繼續執行callbackFn
    next();
  } else {
    return res.send("請先登入");
  }
};

// 連接到本機的MongoDB的exampleDB這個database
mongoose
  .connect("mongodb://127.0.0.1:27017/exampleDB")
  .then(() => {
    console.log(
      "已成功連結到位於本機port 27017的mongoDB，並且連結到mongoDB中exampleDB這個database了"
    );
  })
  .catch((e) => {
    console.log(e);
  });

// ===============================================================================================================
// 把客戶端傳來的資料製作成新的User儲存到users這個collection中，並且password屬性為雜湊值
// 實際使用bcrypt.hash()把客戶傳來的password製作成雜湊值
app.post("/Users", async (req, res) => {
  try {
    let { username, password } = req.body;

    // 使用bcrypt.hash這個異步函式算出一個雜湊值
    // password是客戶端傳來的明文密碼，saltRound在前面就定義過(12)此數值越大這個雜湊運算就需要越多時間完成
    // bcrypt.hash的執行結果就是一個雜湊值，我們這邊用await關鍵字讓他直接return雜湊值而非promise物件
    let hashValue = await bcrypt.hash(password, saltRound);

    // 用User這個Model當成Construcor製作一個新的物件存到newUser裡面
    // password屬性的值就是我們用使用者傳給我們的密碼放進Brycpt雜湊函式中算出的雜湊值
    let newUser = new User({ username, password: hashValue });

    // 因為await關鍵字，所以.save()會直接return存好的那個document
    let saveUser = await newUser.save();
    // 回傳一個裡面包含一個物件的Response
    return res.send({ message: "成功新增使用者", saveUser });
  } catch (e) {
    return res.status(400).send(e);
  }
});

// ===============================================================================================================
// 確認客戶端傳來的資料是否與資料庫中的資料相符
// 實際使用bcrypt.compare()把客戶傳來的password換成雜湊值與資料庫的那個name=客戶端傳來的name的document的password做檢查是否相同
app.post("/users/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    // 因為await關鍵字，所以User.findOne().exec()會直接return執行結果(就是找到的那個document，沒找到就是null)
    let user = await User.findOne({ username }).exec();
    if (user == null) {
      // user為null的話就代表資料庫中沒有符合傳來的username的document
      return res.send(`沒有${username}這個User`);
    } else {
      let correct_password = user.password; // user的password屬性的值就是之前存入的hash value

      console.log(correct_password);
      // bcrypt.compare(passowrd,correct_password)會把password做bctypt與correct_password的鹽巴放進去做雜湊函式算出的雜湊值比較與correct_password是否相同
      // 使用await所以bcrypt.compare()會直接return比較結果是否相同(true or false)
      let result = await bcrypt.compare(password, correct_password);
      console.log(result);
      if (result) {
        req.session.login = true; // 登入成功的話就讓這個客戶端的session id對應的Session物件設定login屬性為true
        return res.send("登入成功");
      } else {
        return res.send("登入失敗");
      }
    }
  } catch (e) {
    return res.send(e);
  }
});

// ===============================================================================================================
// 登出系統
app.get("/users/logout", (req, res) => {
  req.session.login = false; // 把這個客戶端的session id對應的Session物件設定login屬性為true
  res.send("您已經登出系統");
});

// ===============================================================================================================
// 模擬需要登入才能使用route的功能
// isLogin這個middleware會去檢查被這個route接收的Request的session id對應的Session物件的login屬性是否為true，不是的話就不會執行callbackFn
app.get("/secret", isLogin, (req, res) => {
  res.send("秘密是:薩摩耶好可愛");
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000...");
});
