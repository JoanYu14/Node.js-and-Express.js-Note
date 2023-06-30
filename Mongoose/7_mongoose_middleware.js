// Mongoose Middleware(中介軟體)
// Mongoose的Middleware是設定在Schema上
// SchemaNmae.pre("會被middleware抓住的動作", callbackFn)
// 第一個參數為使用這個Schema的Model執行甚麼操作會被這個中介軟體抓住(取得異步函式控制權)，例如:save,findOne,find,deleteMany...
// 第二個參數為一個callbackFn，我認為用express function會比較好，因為這樣才能使用this關鍵字綁定使用異步函式的物件(model或document)，箭頭函式沒辦法用this關鍵字

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const fs = require("fs"); // fs (file system文件系統)，是Node.js內建的moudle

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
// 呼叫Schema這個Constructor第二個參數為設定method的物件，可以設定名為methods和statics屬性，這兩個屬性的值都是物件，methods物件內的function就是Instance Method，statics物件內的function就是Static Method
studentSchema = new Schema({
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
});

// 當使用studentSchema的Model所創造的物件要被儲存(document.sava())到對應的collection前，都會進入這個middleware，進入時就會執行middleware的callbackFn
// 這邊pre()的第二個參數為一個function，之所以用express function而不是express arrow function是因為express arrow function的this關鍵字沒辦法綁定任何東西
// express function就可以正常使用this關鍵字，這裡的this關鍵字會綁定使用.sava()這個異步函式的document(用Student製作出來的)
studentSchema.pre("save", function () {
  // writeFile("文件名稱", "要寫的內容", errorFunction(callbackFn))
  console.log(
    `這個要被新增至collection的name屬性的值為"${this.name}"的document正在經過studentSchema的middleware`
  );

  // appendFile("文件名稱", "要寫的內容", errorFunction(callbackFn))
  // fs的appendFile這個method會對workdirectory中名為"第一個參數"的檔案，寫入第二個參數的內容，如果出錯的話會執行第三個參數的函式
  // 如果work directory中沒有名為"第一個參數"的檔案的話，他就會創造一個
  // appendFile()與writeFile()的差別是writeFile會直接覆寫原本檔案的內容，appendFile則是接著原本的內容寫下去
  fs.appendFile(
    "record.txt",
    `A new student ${this.name} will be save...`,
    (e) => {
      if (e) throw e; // 發生問題e就會帶入error object，有error的話這行才會被執行，沒有的話e就不會有東西所以不會執行
    }
  );
});

// 用mongoose物件的.model()這個method製作與students(複數形式)這個collection做連接的model並存入Student變數中。
// Student這個model也可以當成constructor使用，它製作出來的物件會符合studentSchema這個schema設定的document的架構。
Student = mongoose.model("Student", studentSchema);

let newStudent1 = new Student({
  name: "小白",
  age: 26,
  major: "English",
  schlarship: {
    merit: 2000,
    other: 3000,
  },
});

newStudent1
  .save()
  .then((document) => {
    console.log(`${document.name}的資料儲存成功`);
  })
  .catch((e) => {
    console.log(e);
  });

let newStudent2 = new Student({
  name: "小文",
  age: 23,
  major: "Math",
  schlarship: {
    merit: 2500,
    other: 3200,
  },
});

newStudent2
  .save()
  .then((document) => {
    console.log(`${document.name}的資料儲存成功`);
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000....");
});
