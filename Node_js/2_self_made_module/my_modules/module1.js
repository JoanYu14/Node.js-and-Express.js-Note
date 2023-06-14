function module_1() {
  console.log("這是在my_module資料夾內的module1這個檔案的函式");
}

// 設定module_1的module物件的exports這個物件的module_1這個屬性為module_1這個function
exports.module_1 = module_1;
