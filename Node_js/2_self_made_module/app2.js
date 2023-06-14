// 定義一個名為lunch的function
function lunch() {
  console.log("午餐時間");
}

// 設定app2的module物件的exports物件的lunch屬性為lunch這個函式
// 這樣其他文件require app2這個module時，app2的exports物件就會被return給那個文件，並且裡面有lunch這個method
exports.lunch = lunch;
