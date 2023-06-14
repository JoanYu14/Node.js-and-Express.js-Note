// 如果require一個資料夾的話，它就會return那個資料夾內的名為index.js檔案的exports物件

// 把my_modules資料夾內的index.js檔案的exports物件存到modules變數內
let modules = require("./my_modules");

// my_modules資料夾內的index.js檔案的exports物件有module_1與module_2這兩個method
modules.module_1(); // 這是在my_module資料夾內的module1這個檔案的函式
modules.module_2(); // 這是在my_module資料夾內的module2這個檔案的函式

// 因為我在index.js的exports物件內沒有設定module_3這個屬性，所以即使他在同個資料夾內，也是沒有被require的
// modules.module_3();  ==>>TypeError: modules.module_3 is not a function
