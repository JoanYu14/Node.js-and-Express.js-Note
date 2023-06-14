// Request Object常用的屬性
const express = require("express");
const app = express();

// middlewares語法 : app.use()
// 這兩個function會在每次有客入端傳來request時都會去檢查Content-Type是甚麼，有沒有express.json()或者express.urlencoded()要的東西
// express.json()會去檢查requests的header有沒有Content-Type: application/json。如果有，就把text-based JSON換成JavaScript能夠存取的JSON物件，然後放入req.body。
app.use(express.json());

// express.urlencoded()會去檢查requests的header有沒有Content-Type: application/x-www-form-urlencoded （也就是去檢查是不是帶有資料的POST request）
// 如果有，也把text-based JSON換成JavaScript能夠存取的JSON物件然後放入req.body。
// 如果在urlencoded中設定一個物件，物件有屬性extended值為true的話就可以讓post form中給除了string以外的資料
app.use(express.urlencoded({ extended: true }));

//express.json()以及express.urlencoded()功能一樣，只是處理的Content-Type不同。兩者轉換完成的JSON物件會被放入req.body。

// =============================================================================================================================================================
// 1. req.params : 此屬性是一個物件(預設是空物件)，內部屬性為named route parameters(可以隨便取)
//    例:我們有一個route是/user/:name，則輸入的user/後面的name，這個name的值就會被存到req.params.name裡面
app.get("/furit", (req, res) => {
  res.send("歡迎來到水果頁面");
});

// 任何只要寫在/furit/後面的東西都會自動被叫做someFruit(我給它的name)，所以在route中的這個值可以看做是parameter，因此叫做named route parameter
// 寫在/furit/後面的東西就會被設為req.params物件的someFruit屬性的值
// 輸入http://localhost:3000/furit/watermelon，就會回傳"歡迎來到watermelon頁面"
// 輸入http://localhost:3000/furit/banana，就會回傳"歡迎來到banana頁面"
app.get("/furit/:someFruit", (req, res) => {
  res.send("歡迎來到" + req.params.someFruit + "頁面");
});

// =============================================================================================================================================================
// 2. req.query : 此屬性是一個物件，其中包含route中"?"後面的key-value pair
//      例如我們有Request route是/api/getIser/?id=1，則req.query.id這個屬性的值就會是1
//      html中method為"GET"的form就會發來的endpoint的route就會長這樣

// 在伺服器中的某個html(form_get.html)的form中有設定action="/getform"，並且method="GET"(預設)
// 當有客戶端透過sever的response取得了這個html檔(直接從本地打開html並填入資料是不會傳到伺服器的)，並submmit了html裡的form時
// form中有設定name=的資料就會被傳到sever中處理/getform的這個routing
// 此時req.query屬性這個物件中就會有跟傳來的的form中與資料一樣的name的屬性，並且此屬性的值就是我們填入的值
app.get("/getform", (req, res) => {
  console.log(req.query); // { name: 'Joan', age: '22' }
  res.send(
    "伺服器已收到您的資料，您的名字是:" +
      req.query.name +
      "，您的年齡是:" +
      req.query.age +
      "歲"
  );
});

// 發出GET localhost:3000/get這個request時就回傳包含狀態200 OK與form_get.html這個response給客戶端，此html的form填寫後submmit後會找sever中有沒有處理/getform的(在上面)
app.get("/get", (req, res) => {
  res.sendFile(__dirname + "/form_get.html");
});

// =============================================================================================================================================================
// 3. request.body : 此屬性是一個物件，預設的值是undefined，但如果使用express.json()或express.urlencode()這種middleware
//                   可以讓內部包含POST request寄來的資料訊息，並且用key-value pair來表示

// 在伺服器中的某個html(form_post.html)的form中有設定action="/postform"，並且method="POST"
// 當有客戶端透過sever的response取得了這個html檔(直接從本地打開html並填入資料是不會傳到伺服器的)，並submmit了html裡的form時
// form中有設定name=的資料就會被傳到sever中處理POST /postform的這個routing
// 此時如果上面有設定app.use(express.urlencoded())的話，POST request中的text-based JSON就會換成JavaScript能夠存取的JSON物件然後存到req.boy中
app.post("/postform", (req, res) => {
  // 因為上面有app.use(express.urlencoded());，所以此時req.body就不會是undefined了
  console.log(req.body); // { email: 'a9473@gmail.com', password: 'ffffff' }

  // 解構賦值，把req.body物件中名為email和password的屬性的值分別存到email和password變數中(變數名與屬性要相同)
  let { email, password } = req.body;
  res.send(`伺服器已收到您的資料，您的電子信箱是:${email}`);
});

app.get("/post", (req, res) => {
  res.sendFile(__dirname + "/form_post.html");
});

// =============================================================================================================================================================

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000");
});
