// 刪除collection中的資料
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
  name: String,

  // 設定document的age屬性不能小於0
  // min屬性的值要給一個array，第一個參數為最小值，第二個參數為如果設定的age屬性的值小於最小值的話要給的error message
  // 在newDocument.save()，如果newDocument的age屬性值小於0的話，.save()return的promise物件的狀態就會變成rejected，.catch()的callbackFn的參數就會帶入"年齡不能小於0"
  // 在model.update類的method中，如果有設定options參數的物件runValidators屬性為true，那update參數的物件的age屬性值就不能小於0，小於0的話會變成rejected
  // 如果在model.update類的method中沒有設定options參數的runValidators的話預設為false，那update參數的物件的age屬性值小於0，也照樣會更新資料
  age: { type: Number, min: [0, "年齡不能小於0"] },
  major: String,
  schlarship: {
    merit: Number,
    other: Number,
  },
});

// 用mongoose物件的.model()這個method製作與students(複數形式)這個collection做連接的model並存入Student變數中。
// Student這個model也可以當成constructor使用，它製作出來的物件會符合studentSchema這個schema設定的document的架構。
Student = mongoose.model("Student", studentSchema);

// 1. Model.deleteOne(conditions)
//    刪除Model所對應的collection中第一個符合conditions條件的document
//    return的是一個Query而非Promise
//    .then()的callbackFn中的參數帶入的都是一個object，並且object中只有一個名為deletedCount的屬性，這個屬性的值就是刪除的document數量。

// 刪除Student這個model所連接的collection(students)中第一個name屬性為"Kevin"的document
// Student.deleteOne回傳的是Query，所以用exec()轉為Promise
Student.deleteOne({ name: "Kevin" })
  .exec()
  .then((msg) => {
    console.log(msg); // { acknowledged: true, deletedCount: 1 }
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000....");
});
