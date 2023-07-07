// 為了保持app.js程式碼的簡潔，所以mongoose相關的程式碼我們寫在這裡
// 每個JS檔的所有程式碼其實就是一個module，使用Node.js執行時我們的程式碼其實都被包進Module Wrapper(一個函式)中並且馬上被執行(IIFE)
// 所以我們設定module.exports這個屬性(原本是一個空物件)為設定好的Model(物件)
// 這樣其他JS檔中require("student")時就會return設定好的那個Model而不是一個IIFE的程式碼
// 在其他JS檔中require("student")時，整個module(程式碼)還是會全部執行一次，只是最後會return model而不是所有程式碼
const mongoose = require("mongoose");

// 連接到本機的MongoDB的exampleDB這個database
mongoose
  .connect("mongodb://127.0.0.1:27017/exampleDB")
  .then(() => {
    console.log(
      "users.js的mongoose已成功連結到位於本機port 27017的mongoDB，並且連結到mongoDB中exampleDB這個database了"
    );
  })
  .catch((e) => {
    console.log(e);
  });

// 利用物件的解構賦值的語法取得mongoose物件中名為Schema的屬性的值(一個constructor function)
const { Schema } = mongoose;

// 用Schema這個Constructor來製作一個schema，並存入名為userSchema的變數中
const userSchema = new Schema({
  username: {
    type: String,
    required: true, // required驗證器為true是代表username這個屬性一定要有值
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
// 設定這個module的exports屬性變成User這個model，這樣別的JS程式required("users")的時候就是會return這個model

module.exports = User;
