// 更新collection中的資料
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

// 1. Model.updateOne(filter, update, options)
// 更新collection中第一筆符合filter條件的document更新的資料為update物件中的資料，.then()的callbackFn的參數帶入的是更新操作的訊息。
// 因為有設定options參數的物件runValidators屬性為true，所以我們在update物件中設定age的值為-5不符合studentSchema中設定的age的值(物件)中的min屬性設定的最小值不能小於0
// 因此雖然操作沒失敗(狀態還是變成fulfilled)但資料並沒有做更新，從.then()的callbackFn帶入的data的值就能看出
/*
Student.updateOne({ name: "Kevin" }, { age: -5 }, { runValidators: true })
  .exec()
  .then((msg) => {
    console.log(msg);
  })
  .catch((e) => {
    console.log(e);
  });
*/

// ======================================================================================================================================================

// 2. Model.findOneAndUpdate(filter, update, options)
//    找到第一個符合condition條件的document，並且更新update物件的值。
//    .then()內部的callback被執行時，若在options內部有表明new屬性為true，則.then()內部的callback被執行時，帶入的parameter會是更新完成了document。
//    反之， 沒有表明new是true，或設定new是false (這是預設值)，則callback的parameter會是更新前的document。Options中也可設定runValidators。
Student.findOneAndUpdate(
  { name: "Jessica" },
  { age: 36 },
  { new: true, runValidators: true }
)
  .exec()
  .then((afterUpdate) => {
    // 因為在options物件中有設定new屬性為true，所以參數afterUpdate帶入的就是更新後的document
    console.log("更新成功，更新後的document為");
    console.log(afterUpdate);
  })
  .catch((e) => {
    consoelg.log(e);
  });

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000....");
});
