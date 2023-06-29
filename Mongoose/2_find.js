// 使用model來對collection做查詢的動作
// 這些用於查詢的method也都是異步函式但return的都是Query而非promise，這是mongoose獨有的data type

const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");

// 連接到本機的MongoDB的exampleDB這個database
mongoose
  .connect("mongodb://127.0.0.1:27017/exampleDB")
  .then(() => {
    console.log(
      "已成功連結到位於本機port 27017的mongoDB，並且連結到mongoDB中exampleDB這個database了"
    );
  })
  .catch((e) => {
    console.log("連接失敗");
    console.log(e);
  });

// 利用物件的解構賦值的語法取得mongoose物件中名為Schema的屬性的值(一個constructor function)
const { Schema } = mongoose;

// 用Schema這個Constructor來製作一個schema，並存入名為studentSchema的變數中
studentSchema = new Schema({
  name: { type: String },
  age: Number,
  major: String,
  schlarship: { merti: Number, other: Number },
});

// 用mongoose物件的.model()這個method製作與students(複數形式)這個collection做連接的model並存入Student變數中。
// Student這個model也可以當成constructor使用，它製作出來的物件會符合studentSchema這個schema設定的document的架構。
const Student = mongoose.model("Student", studentSchema);

// =========================================================================================================================================================================================
// 1. modelName.find( filter )
// 會去查找這個model所連接的collection中所有符合filter條件的document
// 參數filter是一個物件，用來過濾要查找的document
// .then()的callbackFn中的參數帶入的是查詢得到的結果是一個陣列，陣列中有所有符合filter條件的document
// 是異步函式但return的是Query，因此我們要用.exec()把Query變成Promise物件

// 用Student這個model去對students這個collection做查詢的動作，filter為一個空物件，所以會讀取students中所有document。
// .find()回傳的是Query，因此我們用.exec()把Query變成Promise物件
Student.find({})
  .exec()
  .then((data) => {
    // data帶入的就是查詢的結果，長度為3的array，array內的元素符合就是document
    console.log(data);
  })
  .catch((e) => {
    console.log(e);
  });

// 查詢students這個collection中所有schlarship.other的值大於2000的document
// filter的寫法與在mongosh一樣，比較運算符可以在MongoDB網站的Query and Projection Operators頁面查詢
Student.find({ "schlarship.other": { $gt: 2000 } })
  .exec()
  .then((data) => {
    console.log(
      "這些是students這個collection中所有schlarship.other的值大於2000的document"
    );
    console.log(data);
  })
  .catch((e) => {
    console.log(e);
  });

// 在瀏覽器輸入localhost:3000就會觸發server中的這個route
app.get("/", async (req, res) => {
  try {
    // Student.find()會return一個Query我們把這個Query用.exec()轉換成Promise物件
    // 在前面加上await，Student.find({}).exec()會return的值就是查詢的結果而不是Promise物件
    let allData = await Student.find({}).exec();
    // 把這個結果寄回客戶端
    res.send(allData);
  } catch (e) {
    res.send(e);
  }
});

// =========================================================================================================================================================================================
// 2. modelName.findOne( filter )
// 會去查找這個model所連接的collection中所有第一個符合filter條件的document
// 查詢得到的結果是一個物件，就是document

// 用Student這個model查詢students這個collection中第一個符合name屬性的值為"Joan"的document
Student.findOne({ name: "Joan" })
  .exec()
  .then((data) => {
    console.log(data);
  });
app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000...");
});
