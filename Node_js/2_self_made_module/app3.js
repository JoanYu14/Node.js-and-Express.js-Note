// require這個function會return我們調用的module的export物件

// 因為app1是被包在module wrapper這個function內，並且會馬上執行，所以app1內的程式碼都會被執行一遍，所以執行app3的時候也會印出在app1寫的console.log...
// 最後require還會回傳app1的module物件的exports物件，所以我們用app1變數把這個exports物件存起來
let app1 = require("./app1");
app1.sayHi(); // 印出你好。app1的exports物件有sayHi()這個method，所以就可以使用

// require除了執行app2的程式碼外，還會把app2的exports物件給return出來，所以我們用app2變數把這個exports物件存起來
let app2 = require("./app2");
app2.lunch(); // 印出午餐時間，因為app2的exports物件有lunch()這個method
