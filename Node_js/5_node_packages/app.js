// 在dependencies的module可以直接require
const cowsay = require("cowsay");

console.log(
  cowsay.say({
    text: "牛", // 牛要說的話
    e: "oO", // 牛的眼睛
    T: "U ", // 牛的舌頭
  })
);

// or cowsay.think()
