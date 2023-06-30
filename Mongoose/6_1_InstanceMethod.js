// 6_InstanceMethod_and_StaticMethod.js
// Instance Method
// 每個用Model創建的物件(document)都能繼承的method就稱作instance method
// 原本就在Model所對應的collection內的document也都能使用
// Schema就映射到collection，model就是把Schema包起來的容器，提供一個接口讓我們對這個colleciton做操作

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
    // 1. 定義Instance Method的語法1
    //    methods內定義的函式都是Instance Method，所以用method創造出來的document都有繼承到這些method，原本就在model所對應的collection內的document也都能使用
    methods: {
      printTotalSchlarship() {
        // this關鍵字會綁定我們用使用這個Schema的Model所創造出來的物件(document)
        // return使用該method的物件的獎學金總和
        return this.schlarship.merit + this.schlarship.other;
      },
    },
  }
);

// =========================================================================================================================================================================================
// 2. 定義Instance Method的語法2
//    直接設定指定schema的methods屬性的(我們要取的Instance Method的名稱)屬性的值為一個function

// 把studentSchema的methods屬性的studentAgelessThan25這個屬性的值存入一個匿名函式
// 因此studentAgelessThan25()就會是一個Instance Method
studentSchema.methods.studentAgelessThan25 = function () {
  // studentAgelessThan25()會return呼叫這個函式的document的age屬性的值是否小於25，所以是return一個布林值
  return this.age < 25;
};

// 用mongoose物件的.model()這個method製作與students(複數形式)這個collection做連接的model並存入Student變數中。
// Student這個model也可以當成constructor使用，它製作出來的物件會符合studentSchema這個schema設定的document的架構。
Student = mongoose.model("Student", studentSchema);

// 執行語法1設定的Instance Method
// 執行這程式碼會印出MongoDB中名為exampleDB的database的students這個collection中，所有document的名字與該document的schlarship總和
// Stundent.find()的執行結果是一個陣列，陣列中的元素就是collection所有的document。
Student.find()
  .exec()
  .then((docArr) => {
    // docArr帶入的是一個陣列，陣列中的元素就是document。
    docArr.forEach((document) => {
      // 每個用Student這個model所創建的document都能擁有printTotalSchlarship()這個Instance Method
      console.log(
        `${document.name}的獎學金總共為${document.printTotalSchlarship()}元`
      );
    });
  })
  .catch((e) => {
    console.log(e);
  });

// 執行語法2設定的Instance Method
Student.find()
  .exec()
  .then((docArr) => {
    docArr.forEach((document) => {
      console.log(
        `${document.name}的年齡是否小於25歲: ${document.studentAgelessThan25()}`
      );
    });
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000....");
});
