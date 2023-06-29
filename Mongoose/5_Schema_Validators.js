// Schema Validators(Schema驗證器)

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
    console.log(e);
  });

// 利用物件的解構賦值的語法取得mongoose物件中名為Schema的屬性的值(一個constructor function)
const { Schema } = mongoose;

// 用Schema這個Constructor來製作一個schema，並存入名為studentSchema的變數中
studentSchema = new Schema({
  // required驗證器為true是代表name這個屬性一定要有值，這行是最簡單的寫法
  // maxlength驗證器值為25，代表新創建的物件或update的物件的name屬性的字串長度不能超過25，超過的話會出錯
  name: { type: String, required: true, maxlength: 25 },
  age: { type: Number, min: [0, "年齡不能小於0"] },
  // 設定major這個屬性有required驗證器，值為一個陣列，第一個元素為是否啟用required驗證器(一個boolean)，第二個元素為如果不符合required驗證器的話會帶入的錯誤訊息
  major: {
    type: String,
    required: function () {
      // required的值也可以放function，所以我們這裡放一個匿名函式

      // 如果新創建的物件的schlarship.merit大於等於3000的話，required就會為true
      // 代表如果新創建的物件的schlarship.merit大於等於3000的話，這個新物件就必須設定major這個屬性
      // 如果新創建的物件的schlarship.merit小於3000的話，這個新物件就可以不用設定major這個屬性
      return this.schlarship.merit >= 3000;
    },
    enum: [
      // 如果有人在major屬性填的值不符合enum陣列裡面的字串的話，就會操作失敗(rejected，save()或update()都是)
      "Chemistry",
      "Computer Science",
      "Finance",
      "English",
      "Math",
      "undecided",
    ],
  },
  schlarship: {
    merit: { type: Number, default: 0 }, // 如果新創建的物件的這兩種屬性(獎學金)都沒填的話，預設就會給這兩個屬性0的數值
    other: { type: Number, default: 0 },
  },
});

// 用mongoose物件的.model()這個method製作與students(複數形式)這個collection做連接的model並存入Student變數中。
// Student這個model也可以當成constructor使用，它製作出來的物件會符合studentSchema這個schema設定的document的架構。
Student = mongoose.model("Student", studentSchema);

// studentSchema的name屬性的maxlength驗證器的值為25，newStudent的name屬性長度為26，所以.save()會出錯
let newStudent = new Student({
  name: "abcdefghijklmnopqrstuvwxyz",
  age: 29,
  major: "Computer Science",
  schlarship: {
    merit: 1500,
    other: 2000,
  },
});

newStudent
  .save()
  .then((data) => {
    console.log(data);
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000....");
});
