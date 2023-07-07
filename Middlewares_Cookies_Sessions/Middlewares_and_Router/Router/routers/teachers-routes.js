// teachers-routes.js
// 這個router裡的route是專門處理/teachers的Request
const express = require("express");
const router = express.Router(); // 得到router物件，這個router物件在這個檔案的功能就跟app.js中app的功能很類似

// 要使用在route內部的middleware
function inRouteMiddleware(req, res, next) {
  console.log(
    // __filename是module wrapper參數所提供的(這整個程式碼都是被包在module warpper中的)
    `${__filename}的router的${req.method} ${req.url}這個route接收到Request`
  );
  next();
}

router.get("/", (req, res) => {
  res.send("歡迎來到教師首頁");
});

router.get("/new", (req, res) => {
  res.send("這是新增教師資料頁面");
});

// 把整個router物件取代module.exports物件，這樣app.js在require(”teachers-rotes”)時得到的東西就是整個router
module.exports = router;
