// Router
// 將routes根據功能分類，Express.js提供了express.Router的功能，讓我們可以將routes分門別類

const express = require("express");
const mongoose = require("mongoose");
const app = express();
// 使用method-overrite這個package能讓我們在客戶端也能寄送除了GET和POST的其他Request
const methodOverrite = require("method-override");

const studentsRoutes = require("./routers/students-routes"); // 得取students-routes.js的router
const teachersRoutes = require("./routers/teachers-routes"); // 得取teachers-routes.js的router

// 在mongooseModel資料夾的student.js這個檔案內已經設定好Student這個model，並設定module.exports = Student，所以require("./mongooseModel/student") return就是Student這個modle
// const Student = require("./mongooseModel/student"); 放到處理sutdents collection的router裡面

app.set("view engine", "ejs");

// ==========================================================================================================================================================================================================
// Middleware

// 定義一個叫做globalMiddleware的function，它會當作middleware使用
// 這個middleware會放在所有route前
function globalMiddleware(req, res, next) {
  // req參數內就是帶入request物件，req.method裡面就會寫它是哪種http request(GET、POST、PUT)
  // 如果有接收到GET、POST以外的Request的話，很大機率就是有經過method-overrite("_method")這個middleware處理過了
  console.log(`接收到一個${req.method}的Request`);
  next(); // 呼叫next函式後這個request的東西的控制權就會被傳下去
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverrite("_method"));
// 在所有route前使用這個middleware，所以每當有request送到server時都會進入這個中介軟體
// console印出正在執行`接收到一個${req.method}的Request`後就會把這個request再往下傳
app.use(globalMiddleware);

// ***************** Router *******************
// 放在所有app.use(middleware)下面，也就是Request經過所有上方的middleware處理後，在經過這裡檢查URL
// app.use(”/students”,birds) : 也就是說經過上面的middleware傳下來的Request都會經過這裡檢查有沒有跟/students有關的url，例如/students/edit、/students/new
// 如果有的話，這個Request就要去使用studentsRoutes這個router(裡面可能還要經過一些middleware之類的)裡面的routes來處理。
// 就是因為URL要有/students才會進到studentsRoutes裡面，所以students.routers.js的router.在設定path時才不用在寫/stuents
app.use("/students", studentsRoutes);

// 經過上面的middleware傳下來的Request都會經過這裡檢查有沒有跟/teachers有關的url，如果是有/students有關的URL，在上面就會被接收走了，就不會經過這裡了
app.use("/teachers", teachersRoutes);

// 會用在很多route內部的middleware就可以用function declaration的方式給一個名稱，這樣就可以方便重複使用
// 用在router內部的route的middleware在那個js內部要有定義，不然無法使用
// 到時候如果要用在route的middleware變多了，且多個router的routes都會用到的話(例如可能有多個router的route需要登入才能執行)
// 可以製作一個routeMiddleware.js，裡面可以製作名為middlewares的物件，因為middleware其實也是函數，所以物件內部就可以有多個method，他們都是middleware
// 然後在最後面讓module.exports = middlewares，這樣就可以在router的JS檔裡面require("routeMiddleware")，這樣得到的就是middlewares物件
// 在route內部就可以使用可能middlewares.login這個middleware(function)
/* 
function inRouteMiddleware(req, res, next) {
  console.log(`${req.method} ${req.url}這個route接收到Request`); // req.url為客戶在localhost:3000後輸入的字串
  next();
}
*/

// ==========================================================================================================================================================================================================

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

// ==========================================================================================================================================================================================================
// 這個middleware是處理上面的route傳下來的e物件(錯誤)，e會被當作argument帶入到parameter err裡面
app.use((err, req, res, next) => {
  // return res.status(400).send(err); 會直接寄送一個JSON檔到客戶端，裡面就是一個error object

  // 把一個物件傳到error.ejs裡面，物件內e屬性為err這個local Variable，所以在error.ejs內就可以使用e，e的值就是錯誤物件
  return res.status(400).render("error", { e: err });
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000...");
});
