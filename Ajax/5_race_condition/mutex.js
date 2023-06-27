let deposit = 0; // shared resource(共享資源)
let mutex = Promise.resolve(); // 回傳一個狀態為fulfilled的promise物件，並用mutex變數存起來，因為在第一次執行賣葡萄或賣橄欖函式時mutex.then要能被執行

const randomDelay = () => {
  // randomDelay是同步函式，只是我們讓它像是異步函式一樣return一個promise物件，並且利用setTimout模擬promise物件由pending變成fulfilled
  // return的值是一個promise物件(使用Promise這個Constructor function製作一個promise物件)
  // 這個promise物件由pending變成fulfilled的時間是由Math.random() * 100所控制的
  // 0~0.1秒都有可能
  // 這個randomDelay函式會在下面的異步函式內被呼叫
  return new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
};

// 因為實際上我們要得到deposit資料的時候是需要跟銀行的伺服器做連線的，所以需要一點時間才會把deposit資料給你，因此這裡就模擬需要等0~0.1秒
async function loadDeposit() {
  // 因為await關鍵字，所以一定要等randomDelay()的promise物件變成fulfilled才會繼續，所以要等隨機的0s~0.1s，最後randomDelay()回傳的會是promise物件的值並非promise物件。
  await randomDelay();
  // loadDeposit()是異步函式，所以一定會return一個promise物件，裡面寫return deposit，代表這個異步函式會return值為deposit的promise物件
  return deposit;
}

// 定義一個異步函式把deposit的值改成變動後的值
async function savedeposit(value) {
  await randomDelay(); // 因為await關鍵字，所以要等randomDelay()這個同步函式return的promise物件變成fulfilled才會繼續執行(模擬與銀行伺服器連線)
  deposit = value; // 讓deposit的值變成value的值(此函式在帳戶金額會變更時才呼叫，並且呼叫時會給一個argument帶入value參數中)
}

async function sellGrapes() {
  // mutex.then會return一個狀態為pending的promise物件，所以我們把這個promise物件再存回mutex(此時mutex就變成pending狀態的promise物件而不是fulfilled狀態的)
  // 並且因為.then的callbackFn內並沒有return任何值，所以mutex.then所return的promise物件在狀態變成fulfilled後，值是undefined
  mutex = mutex
    .then(async () => {
      const deposit = await loadDeposit();
      console.log(`賣葡萄前，帳戶金額為: ${deposit}`);
      const newdeposit = deposit + 50; // 賣葡萄後帳戶餘額(deposit)要加50，所以把新的餘額用存入newposit變數中
      await savedeposit(newdeposit); // 呼叫savedeposit函式並把newdeposit當作引數代替savedeposit()的value參數，deposit的值就會被更新
      console.log(`賣葡萄後，帳戶金額為: ${newdeposit}`);
    })
    .catch((e) => {
      console.log(e);
    });

  // 異步函式一定會return一個promise物件，所以我們就讓sellGrapes()這個異步函式會return mutex這個值為undefinded為promise物件
  return mutex;
}

async function sellOlives() {
  mutex = mutex
    .then(async () => {
      const deposit = await loadDeposit();
      console.log(`賣橄欖前，帳戶金額為: ${deposit}`);
      const newdeposit = deposit + 50;
      await savedeposit(newdeposit);
      console.log(`賣橄欖後，帳戶金額為: ${newdeposit}`);
    })
    .catch((e) => {
      console.log(e);
    });
  return mutex;
}

async function main() {
  // 因為await關鍵字，所以要等到Promise.all()的promise物件變成fulfilled或rejected才會繼續下面的程式碼
  // Promise.all()接收的array中的所有promise物件都變成fulfilled狀態的話，那Promise.all()的那個promise物件的狀態也會變成fulfilled
  await Promise.all([
    sellGrapes(),
    sellOlives(),
    sellOlives(),
    sellOlives(),
    sellGrapes(),
    sellGrapes(),
    sellGrapes(),
  ]);
  const deposit = await loadDeposit();
  console.log(`賣葡萄與橄欖後的帳戶金額是$${deposit}`); // 可以發現金額是正確的，因為使用了mutex所以不會發生race condition
}

main();

/*
賣葡萄前，帳戶金額為: 0   因為mutex本來就是狀態為fulfilled的promise物件，所以第一個sellGrapes()的mutex.then()被執行了，此時mutex就會變成mutex.then所return的狀態為pending的promise物件(上鎖)，然後sellGrapes()就會return mutex這個物件(不寫好像也不會錯)
賣葡萄後，帳戶金額為: 50  執行完這行代表第一個sellGrapes()執行完畢了，此時mutex這個promise物件的狀態就會由pending狀態變成fulfilled狀態(解鎖)，下一個thread就可以執行mutex.then了
賣橄欖前，帳戶金額為: 50  雖然sellOlives()也是異步函式但因為它的callbackFn都在mutex.then裡，代表要在mutex為fulfilled時才能執行，所以要等上一個使用mutex=mutex.then的異步函式執行完才能換它執行
賣橄欖後，帳戶金額為: 100 執行完這行代表第二個sellOlives()執行完畢了，此時mutex這個promise物件的狀態就會由pending狀態變成fulfilled狀態(解鎖)，下一個thread就可以執行mutex.then了
賣橄欖前，帳戶金額為: 100
賣橄欖後，帳戶金額為: 150
賣橄欖前，帳戶金額為: 150
賣橄欖後，帳戶金額為: 200
賣葡萄前，帳戶金額為: 200
賣葡萄後，帳戶金額為: 250
賣葡萄前，帳戶金額為: 250
賣葡萄後，帳戶金額為: 300
賣葡萄前，帳戶金額為: 300
賣葡萄後，帳戶金額為: 350
賣葡萄與橄欖後的帳戶金額是$350
*/
