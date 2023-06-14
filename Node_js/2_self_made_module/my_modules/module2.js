function module_2() {
  console.log("這是在my_module資料夾內的module2這個檔案的函式");
}

// 設定module_2的module物件的exports這個物件的module_2這個屬性為module_2這個function
exports.module_2 = module_2;
