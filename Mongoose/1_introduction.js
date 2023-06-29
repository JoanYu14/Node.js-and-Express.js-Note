// mongoose
// 這裡包含了mongoose的基本介紹、shema與model製作的註解、對collection新增document

// require "express"這個package，然後express會存入一個function(因為在express這呃module設定module.exports就是一個function，所以就不是物件了)
const express = require("express");
const app = express();
// require "mongoose"這個package，mongoose會存入一個object，
const mongoose = require("mongoose");

// object的解構賦值語法，從mongoose物件中找到名為Schema的屬性，並把它的值存入Schema變數中，這個值為一個Construtor(Class)
const { Schema } = mongoose;

// 這裡設定了我們用的view engine是ejs，代表我們要渲染的東西都是ejs文件，這樣我們後面用res.render渲染ejs文件時都不用打附檔名了
app.set("view engine", "ejs");

// mongoDB是在我們電腦的本地的prot 27017上面運行的
// "mongodb://localhost:27017/exampleDB"不行的話要改成"mongodb://127.0.0.1:27017/exampleDB"
// localhost這個字在電腦內的DNS會被轉換成127.0.0.1，所以一般的情況來說，都是可以轉換的。會發生上面的錯誤是因為，電腦的編碼無法將localhost轉換成127.0.0.1

// mongoose.connect("mongodb://mongoDB的位置/要連接的mongoDB的database名稱")
// mongoose物件中有一個method叫做connect()，是一個異步函式，所以會return一個promise物件，因此可以使用.then和.catch。
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

// 創建Schema語法 (像是SQL中create table的動作)
// Schema這個Constructor Function是在上面就從mongoose物件中取得的。
// const SchemaName = new Schema({key:value(值為一個物件，物件中的屬性的值為schemaType(開頭為大寫)) })
// 創建studentSchema用於設定collection中的document的架構
// 呼叫Schema這個Constructor，Schema這個Constructor function的參數為一個物件
// 物件內定義的key就是document的屬性，value為值為schemaType的物件(這裡的例子因為都只有設定type資料型別所以看不出來)
const studentSchema = new Schema({
  // 其實完整寫法為name: {type:String}, 因為只有設定datatype所以就可以用簡化寫法。
  // String與Number就是schemaType，schemaType的開頭都是大寫。
  name: String,
  age: Number,
  major: String,
  schlarship: {
    merit: Number,
    other: Number,
  },
});

// Model語法
// const CollectionName = mongoose.model("CollectionName(單數形式)", "SchemaName")
// 這個monoose.model()所return的東西(model)也可以當作一個Constructor function使用，用來製作符合CollectionName的這個collection的document架構(schema設定的)的物件
// 並且用這個model製作出來的物件用sava的話就用被存入mongoose.connect()的那個database中名為參數1的那個collection
// 此函式的第一個參數為字串，就是我們要製作或連接的collection要叫甚麼名稱這裡就輸入那個名稱的單數形式(mongoose會自動幫我們轉成複數)
// 如果第一個參數輸入的字串的複數形式在目前mongoose.connect所連接MongoDB的database中不存在的話它就會創造這個Collection，如果存在的話就是連接這個collection
// 此函式的第二個參數為我們要使用的Schema的名稱，像例子:就是我們要讓這個blogs這個collection的document的架構為blogSchema這個schema設定的。
// const 變數名稱，這個變數名稱要叫甚麼其實都可以，但是為了避免混淆所以我們會取與第一個參數一樣的名稱(CollectionName(單數形式))。

// 因為參數1 "Student"的複數開頭為小寫的字串為 "students"，這個collection在exampleDB中已經存在了，所以用Student(const變數)這個Model所製作的物件就會與students這個collection連接
// 參數2為studentSchema這個用Schema(Class)製作的物件，代表用Student(const變數)這個Contructor所製作的物件的document架構會為studentSchema設定的樣子
// Student就是可以用來對stuents這個collection進行曾山查改的model
const Student = mongoose.model("Student", studentSchema);

// 變數newObject中存入用Student這個mongoose.model回傳的construcor(model)製作的物件，這個物件會與students這個collection有關聯
newObject = new Student({
  name: "Kevin",
  age: 24,
  major: "Finance",
  schlarship: {
    merit: 6000,
    other: 7000,
  },
});

// =========================================================================================================================================================================================
// 1. 對collection做新增的動作
// document.save()
// .save()是mongoose.model回傳的Model所製作的物件會有的method
// 這個method是一個異步函式，所以會return一個promise物件，如果儲存成功的話就會變成fulfilled，並且promise物件的值為被儲存的document本身。
// .save()就是新增物件到mongoDB的database(看mongoose.connect連接哪個)的collection(看物件是由哪個Model製作的，再看那個Model被製作出來時mongoose.model()放的第一個參數的複數形式為何)中

// 把newObject存入mongoose.connect()連接的database(exampleDB)中的製作它出來的Model連接的那個collection (mongoose.model()的第一個參數的複數(students))中
newObject
  .save()
  .then((saveObject) => {
    // newObject被儲存到MongoDB的exampleDB這個database中的students這個collection了
    // saveObject所帶入的值就是newObject(在記憶體中位置也相同)
    console.log("資料已經儲存完畢，儲存的資料為");
    console.log(saveObject);
  })
  .catch((e) => {
    console.log("資料儲存失敗");
    console.log(e);
  });

// 我們執行程式碼就會啟動這個伺服器，這個sever就會24小時不斷地去聆聽有沒有從各種地方來的請求
app.listen(3000, () => {
  console.log("伺服器正在聆聽port3000...");
});
