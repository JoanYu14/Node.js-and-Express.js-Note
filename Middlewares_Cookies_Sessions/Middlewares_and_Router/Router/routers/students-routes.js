// students-routes.js
// 這個router裡的route是專門處理/students/的Request
const express = require("express");
const router = express.Router(); // 得到router物件，這個router物件在這個檔案的功能就跟app.js中app的功能很類似

// 在mongooseModel資料夾的student.js這個檔案內已經設定好Student這個model，並設定module.exports = Student，所以require("./mongooseModel/student") return就是Student這個modle
const Student = require("../mongooseModel/student");

// 要使用在route內部的middleware
function inRouteMiddleware(req, res, next) {
  console.log(
    `${__filename}的router的${req.method} ${req.url}這個route接收到Request` // __filename是module wrapper參數所提供的(這整個程式碼都是被包在module warpper中的)
  );
  next();
}

// ==========================================================================================================================================================================================================
// 把所有與/studetns有關的route都放進來，並把route的path參數中students的部分刪掉，然後app.都要改成router.
// 1.尋找所有學生(學生首頁)
// 當這個Route接收到Request時，這個Request就會先進入inRouteMiddleware這個中介軟體，執行完交出Request控制權後才會繼續
// 所以一旦這個route接收到Request，console就會印出GET /students這個route接收到Request
// route的callbackFn(地三個參數)的next參數可以讓我們在catch把e物件往下傳到所有route下面的處理錯誤的middleware
router.get("/", inRouteMiddleware, async (req, res, next) => {
  try {
    // await Student.find().exec()會return一個collection中所有的document(物件)的一個陣列，把此陣列存入studentArr變數中
    let studentsArr = await Student.find().exec();

    return res.render("students", { studentsArr }); // studentsArr:studentsArr的簡化寫法
  } catch (e) {
    // return res.status(500).send("尋找資料時伺服器發生錯誤");
    next(e); // 會被所有route的下面的有err參數的middleware接住
  }
});

// ==========================================================================================================================================================================================================
// 2.新增一個學生

// 2-1給客戶端新增學生的頁面(GET)
// 要寫在尋找指定學生的route前，不然會被那個route接走，因為app.get("/students/:_id", callbackFn)，就是只要students/後面不管寫甚麼，那個route都會接收
// 如果有人對localhost:3000/students/new-student送一個GET request，就會被這個route接收
// route的callbackFn(地三個參數)的next參數可以讓我們在catch把e物件往下傳到所有route下面的處理錯誤的middleware
router.get("/new", inRouteMiddleware, async (req, res, next) => {
  try {
    res.render("new_student_form");
  } catch (e) {
    next(e);
  }
});

// 2-2新增學生資料到mongoDB中，並回傳包含新增好的學生的資料的頁面(POST)
// POST學生資料(新增學生資料到資料庫中)
// 因為有使用express.urlencoded()這個middleware，所以post request所傳遞的資料就會從JSON解析成JS能存取的資料，並被存進req.body這個物件中
router.post("/", async (req, res) => {
  try {
    let { name, age, major, merit, other } = req.body; // 利用解構賦值語法從req.body這個物件中取得這些屬性的值，並存入這些變數中
    let newStudent = new Student({
      name, // name:name的簡化寫法
      age,
      major,
      schlarship: {
        merit, // merit:merit的簡化寫法
        other,
      },
    });

    let savedStudent = await newStudent.save();

    // 回傳一個內容為一個物件的200OK的Response給客戶端
    return res.render("new_student_data", { savedStudent });
  } catch (e) {
    return res.status(400).render("student_save_fail", { e });
  }
});

// ==========================================================================================================================================================================================================
// 3.獲得指定id學生的資料
// 任何寫在localhost:3000/students/之後的字串都會被當成req.params._id屬性的值(/students/:_id/XXX的不會被這個route接收)
// 如果是在學生首頁點擊學生連結的話基本上是不會有任何問題，但如果客戶是在瀏覽器輸入URL來寄送request到這個route的話就有可能有找不到該id的學生或id根本不符合_id格式的狀況
// 這個route接收到Response時，這個Response會先經過兩個middleware處理(第二個參數的陣列中的函式)
router.get(
  "/:_id",
  [
    inRouteMiddleware,
    (req, res, next) => {
      console.log("要給指定學生的資料");
      next();
    },
  ],
  async (req, res, next) => {
    try {
      let { _id } = req.params; // 利用物件的解構賦值語法把req.parms物件中名為_id屬性的值存到_id變數中

      // Student.findOne()會去尋找students這個collection中第一筆符合_id屬性的值為req.params._id屬性的值的document
      // _id屬性為在collection中儲存一個document時自動給的屬性與值，相當於這個document的primary key
      // 因為filter是看_id是屬性，所以只要沒有符合_id的形式(12 個字節的字符串或 24 個十六進製字符的字符串或整數)就會直接出錯(rejected)而不是得到null結果
      // 因為await關鍵字，所以Student.findOne().exec()這個異步函式所return的不是一個pending狀態promise物件，而是這個異步函式的執行結果(變成fulfilled狀態後promise物件的值)
      let document = await Student.findOne({ _id }).exec(); // { _id }為{_id : _id}的簡化寫法

      // 如果輸入的id是符合_id的格式(12 個字節的字符串或 24 個十六進製字符的字符串或整數)的話，如果找不到_id屬性的值符合的document的話，findOne()就會回傳null
      if (document != null) {
        // 會去渲染student_page.ejs後並將渲染完成的頁面(html)作為response的內容寄送到客戶端
        return res.render("student_page", { document }); // 傳送一個物件，該物件的document屬性的值就是try中的document這個local variable的值，所以在student_page.ejs中就可以使用document
      } else {
        // 如果輸入的id是符合_id格式，但沒有_id屬性符合的document的話就把_id這個local Variable傳送到student_notfound.ejs裡面
        // 渲染完成後後當作response的內容並寄回給客戶端(status code為400)
        return res.status(400).render("student_notfound", { _id });
      }
    } catch (e) {
      // 如果輸入的id不符合格式的話就會變成rejected，執行catch函式，並且參數e帶入的是一個包含錯誤訊息的物件
      // 或者是別的錯誤也會到這裡

      next(e); // 把錯誤e物件往下傳到處理錯誤的middleware
    }
  }
);

// ==========================================================================================================================================================================================================
// 4.修改特定學生的資料

// 4-1給客戶端一個包含可以用來修改學生資料的form的網頁
router.get("/:_id/edit", async (req, res) => {
  try {
    let { _id } = req.params;
    let student = await Student.findOne({ _id }).exec();

    // 如果輸入的id是符合_id的格式(12 個字節的字符串或 24 個十六進製字符的字符串或整數)的話，如果找不到_id屬性的值符合的document的話，findOne()就會回傳null
    if (student != null) {
      return res.render("student_update", { student });
    } else {
      return res.status(400).render("student_notfound", { _id });
    }
  } catch (e) {
    // 如果輸入的id不符合格式的話就會變成rejected，執行catch函式，並且參數e帶入的是一個包含錯誤訊息的物件
    // 或者是別的錯誤也會到這裡
    return res.status(400).render("error", { e });
  }
});

// 4-2修改MongoDB中的指定學生的資料，並回傳包含修改後的學生資料表格的頁面
// PUT修改特定學生的資料(完全覆寫)
// 對http://localhost:3000/students/XXXX寄送一個PUT Request就會被這個route接收
// 任何寫在localhost:3000/students/之後的字串都會被當成req.params._id屬性的值
router.put("/:_id", async (req, res, next) => {
  try {
    // 因為原本的POST Request的header中有Content-Type: application/x-www-form-urlencoded
    // 即使經過method-overrite的middleware處理後變成PUT Request依然是如此
    // 所以content裡的JSON資料也會透過express.urlencoded()這個中介軟體處理為JS可存取的資料並放入req物件的body物件中

    let { name, age, major, merit, other } = req.body;
    let { _id } = req.params; // 利用物件的解構賦值把req.parms._id的值存入_id變數中

    // newData會存入Student.findOneAndUpdate().exec()的執行結果，就是修改後的document(因為有設定new:true)
    let newData = await Student.findOneAndUpdate(
      { _id },
      { name, age, major, schlarship: { merit, other } },
      {
        // options參數
        new: true, // 設定new為true就是findOneAndUpdate()執行的結果會return更新後的document
        runValidators: true, // 會對update參數給的物件檢查是否符合schema中有設定的validators的規定
        // overwrite: true會使findOneAndUpdate會對找到的document的內容做完全的覆寫，因為HTTP PUT Request在通訊的定義上就是要求客戶端提供所有數據(要不要修改的都要給)
        overwrite: true,
      }
    ).exec();

    return res.render("student_update_success", { newData });
  } catch (e) {
    next(e);
  }
});

// ==========================================================================================================================================================================================================
// 5.刪除指定學生的資料
// 從瀏覽器的method為POST的form提交後寄出的POST Request經過method-overrite的中介軟體處理後變成DELETE Request後就會被這個route接收
router.delete("/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let deleteResult = await Student.deleteOne({ _id });

    return res.render("student_delete_success");
  } catch (e) {
    return res.status(500).render("error", { e }); // 這邊與上面不同，Response的status code我們設定是500
  }
});

module.exports = router; // 把整個router物件取代module.exports物件，這樣app.js在require(”students-routes”)時得到的東西就是整個router
