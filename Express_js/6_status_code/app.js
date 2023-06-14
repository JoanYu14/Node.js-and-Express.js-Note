// Status Code(狀態代碼)

const express = require("express");
const app = express();

// res.status(statusCode) : 可以用來設定傳回給客戶端的Response的status code為何

app.get("/", (req, res) => {
  // 也可以這樣寫因為Method Chaining – 方法鏈。每個方法都會回傳物件本身，允許在單個語句中將方法鏈接在一起，而不需要參數來儲存過渡結果。
  // res.status(200).res.sendFile(__dirname + "/index.html");  因為method chaining所以，res.status()其實會return response object，所以可以這樣寫
  res.status(200); // 這行其實可以不用，因為res.send的status code預設就是200
  res.sendFile(__dirname + "/index.html");
});

// 404 Not Found : 伺服器找不到請求的資源。在瀏覽器中，這意味著無法識別URL。
// 因為404 Not Found實在太常出現了，所以通常伺服器都會有專門處理這個404 Not Found的
// 如果輸入(GET是瀏覽器輸入網址預設method)的路由在伺服器後面隨便亂打的話就會出現404 Not Found
// 如果輸入localhost:3000/aaaaa，因為伺服器沒有專門處理jfijfirj的程式，所以就會在這裡被處理(如果沒有這個程式碼的話就會是Cannot GET /aaaaa，並且status code為404)
// "*"就代表客戶端輸入的伺服器網址後(localhost:3000/後)的所有可能
app.get("*", (req, res) => {
  res.status(404); // 把這個response的status code設定為404，表示Not Found，沒設定status code為404的話，從客戶端看其實還是200這個status code，因為我們有send
  res.sendFile(__dirname + "/notFound.html"); // 這裡要send東西，不然客戶端的request會停滯，因為app.get("*",())已經把request東西的控制權掌握了
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000....");
});
