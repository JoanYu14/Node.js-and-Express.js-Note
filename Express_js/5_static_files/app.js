// Static Files(靜態文件)
// 是客戶端可以從伺服器下載的文件
// 例如CSS文件、網頁中的圖片、JavaScript文件、404錯誤訊息網頁等等
// 這些都是網頁伺服器不需要通過腳本語言，而是可以直接寄給客戶端的文件。
// 在Express.js當中預設的情況下是不允許我們提供Static Files的，所以我們需要先使用middleware(app.use(express.static("public")))才能提供

const express = require("express");
const app = express();

// app.use(express.static("public"))
// 用express.static("public")代表我們要提供在public內的static files
// 需要在work directory當中創建一個名為"public"的資料夾，所有的static files都可以放進public資料夾內部
// 注意!!當Express查找public資料夾內部的文件時，使用的是相對路徑，並且public資料夾的名稱不是URL的一部份
app.use(express.static("public"));

// page.html的head裡面有<link rel="stylesheet" href="./style.css" />，因為app.use(express.static("public"))會直接到public這個資料夾內部找
// 所以才不是./public/style.css(不過如果我想要在本地開啟此html並且套用到style.css的話就要使用此寫法了)
// (我自己的理解是傳送過去時就像傳送了一個資料夾，裡面有page.html和從public資料夾取的style.css，所以此時他們就在同一個資料夾，所以就直接寫./style.css)
// 所以這個page.html在客戶端那邊也能套用style.css的樣式了(黑底白字)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/page.html");
});

// 直接傳送圖片會經過腳本語言，所以不用middleware也可以
app.get("/image", (req, res) => {
  res.sendFile(__dirname + "/image1.jpg");
});

// HTML中的圖片因為是static file，所以不會經過腳本語言，可以直接寄送給客戶端，但要放在public資料夾中並讓middleware去public裡面找
// 圖片沒有放在public資料夾中而是直接在work directory的話，HTML是無法顯示此圖片的，會顯示alt
// 還有要記得直接按右上角播放執行程式的話要注意目前終端機的work directory是否與程式所在的相同，不同的話也會發生無法正確傳遞檔案的問題
app.get("/imagepage", (req, res) => {
  res.sendFile(__dirname + "/imagePage.html");
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000");
});
