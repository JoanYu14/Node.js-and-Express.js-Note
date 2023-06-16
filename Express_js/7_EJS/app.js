// EJS
// EJS的全名是「Embedded JavaScript(內嵌式的樣板引擎)」是一個Template Engine(模板引擎)也可以說View Engine(視覺引擎、範本引擎)，可以將邏輯與內容直接嵌入到 HTML 頁面上
// 也就是 EJS 可以讓我們利用 JavaScript 生成 HTML 頁面(或者說我們可以在HTML裡面直接使用JavaScript的程式碼)
// View Engine的功能就是讓模板文件(其實本身都是HTML文件)裡面被填充JavaScript的程式碼後被送到客戶端那邊去

const express = require("express");
const app = express();
// 這裡設定了我們用的view engine是ejs，代表我們要渲染的東西都是ejs文件，這樣我們後面用res.render渲染ejs文件時都不用打附檔名了
app.set("view engine", "ejs");
// 要套用CSS所以要用express.static("public")讓Express.js可以傳送staticFile到客戶端
app.use(express.static("public"));

// ==============================================================================================================================

// res.render(view[,locals])
// 會將view這個模板送到客戶端
// locals就是Local variables，可加可不加，加了就是將view模板套用locals的文字後送到客戶端
// 也就是我們可以給view文件一些Local Variable
app.get("/", (req, res) => {
  // 我們要渲染的對象是index.ejs(ejs文件都要放在views資料夾內)，因為前面有設定view engine用的都是EJS，所以可以不打副檔名
  // 他(EJS)會把index.ejs變成html後送到客戶端那邊去
  res.render("index");
});

// 給view文件Local Varibal的方法
app.get("//:name", (req, res) => {
  // 解構賦值，從req.params物件內找到名為name的屬性，並把它的值存到名為name的變數中
  let { name } = req.params;
  // 在JS當中很常出現一個物件的屬性與variable相同的狀況，所以可以直接寫成{name}(就等於{ name: name })
  // 設定一個物件，物件的name屬性為叫做name的local variable的值，就可以在haveName.ejs中使用name了
  res.render("haveName", { name });
});

// ==============================================================================================================================
// EJS語法練習

app.get("/practice", (req, res) => {
  // 定義一個叫myString的Local Variable，在ejs文件中用<%- myString %>的話<h2></h2>就會被轉成html語法
  let myString = "<h2>這是我給的Local Variable</h2>";
  // 我們要渲染ejsPractice.ejs文件，然後給它myString這個Local Variable，所以在那個文件中可以使用myString
  res.render("ejsPractice", { myString });
});

// ==============================================================================================================================
// EJS表單應用

// 如果在瀏覽器輸入localhost:3000/form那就把form.ejs渲染後給客戶端(Response有status code:200 OK ... content為form.ejs的內容)
app.get("/form", (req, res) => {
  res.render("form");
});

// form.ejs中有<form action="/getform" method="GET">的form標籤，所以這個form中的資料就會由這個routing處理
// 表單中的內容會被存到req.query物件中(http://localhost:3000/getform?name=Joan&age=22)
// req.query中會有名為name的屬性並且值為Joan，還有名為age的屬性並且值為22
app.get("/getform", (req, res) => {
  // 從req.query中找到名為name和age的屬性，並把它們的值分別存到name與age這兩個local variable中
  let { name, age } = req.query;
  // 我們要渲染formResponse.ejs並傳送到客戶端，然後formResponse.ejs這個樣板可以使用name與age這兩個local variable的值
  res.render("formResponse", { name, age });
});

// ==============================================================================================================================
// 模擬從資料庫取得資料並套用到EJS模板中

// 假設我們從資料庫中拿到languages這個資料，它是一個陣列，陣列裡面有五個物件
app.get("/datas", (req, res) => {
  const languages = [
    { name: "Python", rating: 9.5, popularity: 9.7, trending: "super hot" },
    { name: "Java", rating: 9.4, popularity: 8.5, trending: "hot" },
    { name: "C++", rating: 9.2, popularity: 7.7, trending: "hot" },
    { name: "PHP", rating: 9.0, popularity: 5.7, trending: "decreasing" },
    { name: "JS", rating: 8.5, popularity: 8.7, trending: "hot" },
  ];

  // 把languages這個local Variable給data.ejs使用，渲染data.ejs後再傳送到客戶端
  // data.ejs這個檔案也會套用CSS，所以要在app.js的work directory(不是views的)要有public資料夾，並把style.css放在那裡面
  // 因為我們也是把data.ejs從views中取出來，在7_EJS這個work directory做處理，所以data.ejs的link也是同樣寫/style.css
  res.render("data.ejs", { languages });
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000....");
});
