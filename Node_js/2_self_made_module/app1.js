// self made module介紹

// 1.module變數，module變數是一個物件，包含此文件的內部訊息，包含id,path,exports,parent,filename等等資訊
console.log(module);
/*
Module {
  id: '.',
  path: 'c:\\Users\\余瓊紋\\Desktop\\程式\\後端\\node_js\\node_practise\\2_self_made_module',
  exports: {},
  filename: 'c:\\Users\\余瓊紋\\Desktop\\程式\\後端\\node_js\\node_practise\\2_self_made_module\\app1.js',
  loaded: false,
  children: [],
  paths: [
    'c:\\Users\\余瓊紋\\Desktop\\程式\\後端\\node_js\\node_practise\\2_self_made_module\\node_modules',
    'c:\\Users\\余瓊紋\\Desktop\\程式\\後端\\node_js\\node_practise\\node_modules',
    'c:\\Users\\余瓊紋\\Desktop\\程式\\後端\\node_js\\node_modules',
    'c:\\Users\\余瓊紋\\Desktop\\程式\\後端\\node_modules',
    'c:\\Users\\余瓊紋\\Desktop\\程式\\node_modules',
    'c:\\Users\\余瓊紋\\Desktop\\node_modules',
    'c:\\Users\\余瓊紋\\node_modules',
    'c:\\Users\\node_modules',
    'c:\\node_modules'
  ]
}

*/

console.log(module.filename); // c:\Users\余瓊紋\Desktop\程式\後端\node_js\node_practise\2_self_made_module\app1.js

// ===========================================================================================================================

// 2. exports : 是module物件的屬性，本身是一個empty object(空物件)
//    如果我們想要把在此module定義好某個的東西(例如屬性或函式)，在別的module使用的話，就可以設定module.exports.屬性或函式名稱=要在別的module使用的屬性或函式
console.log(module.exports); // {}

// 定義一個名為sayHi的function
function sayHi() {
  console.log("你好");
}
// 設定module.exports這個物件內的sayHi這個屬性就為sayHi這個function。exports前面可以不加module.
// 此時module.exports物件內就有sayHi這個method了，不是空物件了
module.exports.sayHi = sayHi;
console.log(module.exports); // { sayHi: [Function: sayHi] }
