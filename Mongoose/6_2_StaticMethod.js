// Static Method
// 只有使用這個schema的Model物件本身可以用的，Model內部的document不能使用

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
// 呼叫Schema這個Constructor第一個參數為setting這個物件，裡面就是一些Schema規定的document架構(type和validators...)
// 呼叫Schema這個Constructor第二個參數為設定method的物件，可以設定名為methods的屬性，此屬性給一個物件，物件內就可以設定函式，在methods物件內的函式就是Instance Method。
studentSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 25 },
    age: { type: Number, min: [0, "年齡不能小於0"] },
    major: {
      type: String,
      required: function () {
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
  },
  {
    // 1. 定義Static Method的語法1
    // statics屬性內定義的函式都是Static Method，所以只有使用studentSchema的Model(Student)可以使用這個method，model內部的document不能使用
    statics: {
      findAllAgeMoreThan25() {
        // Static Method的this關鍵字綁定的是使用這個schema的Model這個物件(這個例子中就是Student這個Model)
        // 找到這個Model中所有age屬性大於25的document，find()是異步函式，所以findAllAgeMoreThan25()這個return的是this.find()的promise物件
        return this.find({ age: { $gt: 25 } }).exec();
      },
    },
  }
);

// 定義Static Method的語法2
studentSchema.statics.findAllAgeMoreThan25 = function () {
  return this.find({ age: { $gt: 25 } }).exec();
};

// 定義Static Method的語法3
// 使用創建好的Schema物件的static這個method來去定義一個static method，第一個參數為我們要訂一個static method的名稱，第二個參數為匿名function( function expression)
studentSchema.static("findAllAgeMoreThan25", function () {
  return this.find({ age: { $gt: 25 } }).exec();
});

// 用mongoose物件的.model()這個method製作與students(複數形式)這個collection做連接的model並存入Student變數中。
// Student這個model也可以當成constructor使用，它製作出來的物件會符合studentSchema這個schema設定的document的架構。
Student = mongoose.model("Student", studentSchema);

// 使用findAllAgeMoreThan25()這個Static Method
// findAllAgeMoreThan25() return的是model.find()所return的promise物件，所以後面還要接.then()
console.log(
  Student.findAllAgeMoreThan25()
    .then((data) => {
      console.log(data);
    })
    .catch((e) => {
      console.log(e);
    })
);

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000....");
});
