// Node.js內建的Modules

// fs (file system文件系統)
// Node.js內本來就有fs這個module，所以可以直接require
const fs = require("fs");

// fs的method

// 1. writeFile("文件名稱", "要寫的內容", errorFunction(callbackFn))
//    errorFunction直接這樣寫的原因是如果發生問題e就會帶入error object
// fs.writeFile("myFile.txt", "今天天氣不錯", (e) => {
//   if (e) throw e; // 如果有error的話這行才會被執行，沒有的話e就不會有東西所以不會執行

//   console.log("文件已經撰寫完畢"); // 如果沒有error的話就會執行這個
// });

// 執行後就會發現資料夾內多了一個叫myFile.txt的檔案

// ===========================================================================================

// 2. readFile("文件名稱", "編碼", callbackFn(error,data))
fs.readFile("./myFile.txt", "utf-8", (e, data) => {
  if (e) throw e; // 如果有error就會執行這行

  console.log(data); // 會印出今天天氣不錯(如果沒有error就會執行這行)
});

/*
fs.readFile("jfeiojfioej", "utf-8", (e, data) => {
  if (e) throw e; // 如果有error就會執行這行

  console.log(data); // 會印出今天天氣不錯(如果沒有error就會執行這行)
});

就會出現
C:\Users\余瓊紋\Desktop\程式\後端\node_js\node_practise\3_nodejs_module\app.js:29
  if (e) throw e; // 如果有error就會執行這行
         ^

[Error: ENOENT: no such file or directory, open 'C:\Users\余瓊紋\Desktop\程式\後端\node_js\node_practise\3_nodejs_module\jfeiojfioej'] {      
  errno: -4058,
  syscall: 'open',
  path: 'C:\\Users\\余瓊紋\\Desktop\\程式\\後端\\node_js\\node_practise\\3_nodejs_module\\jfeiojfioej'
}
*/
