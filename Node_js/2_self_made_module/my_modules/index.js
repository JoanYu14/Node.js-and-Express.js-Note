// 如果有一個檔案他要require的是my_modules
// 那他就會return這個index.js檔案的module物件的屬性exports的物件

// module1裡存的就是我們require的module1這個module的exports物件
let module1 = require("./module1");
// module2裡存的就是我們require的module2這個module的exports物件
let module2 = require("./module2");
// module3裡存的就是我們require的module3這個module的exports物件
let module3 = require("./module3");

// 把index.js這個檔案的module物件的exports這個物件的module_1屬性設定為module1物件中的module_1這個method
exports.module_1 = module1.module_1;
// 把index.js這個檔案的module物件的exports這個物件的module_2屬性設定為module1物件中的module_1這個method
exports.module_2 = module2.module_2;
// 注意!!因為我這邊並沒有把index.js的exports物件設定module_3屬性，並把module3物件的module_3這個method放進來，所以require my_modules這個資料夾(或者require index.js)並沒有module_3這個method可以用
