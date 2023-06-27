// Race Condition例子
let deposit = 0; // shared resource(共享資源)

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

// 定義一個異步函式把deposit的值改成變動後的值，這個異步函式也會return一個promise物件，但因為callbackFn內沒有return值，所以return的promise物件並沒有值
async function savedeposit(value) {
  await randomDelay(); // 因為await關鍵字，所以要等randomDelay()這個同步函式return的promise物件變成fulfilled才會繼續執行(模擬與銀行伺服器連線)
  deposit = value; // 讓deposit的值變成value的值(此函式在帳戶金額會變更時才呼叫，並且呼叫時會給一個argument帶入value參數中)
}

async function sellGrapes() {
  // 因為await關鍵字，所以要等loadDeposit()這個異步函式return的promise物件變成fulfilled才會繼續執行，並且return的是promise物件的值(異步函式的執行結果)
  // 因為呼叫loadDeposit()前有用await，而randomDelay()異步函式的執行結果就是return deposit，所以這裡就用deposit變數把loadDeposit()所return的deposit的值存起來
  // 如果沒有await的話loadDeposit()會變成return一個值為deposit的promise物件。那deposit這個值就要用randomDelay().then(deposit_value)帶入參數deposit_value來使用。
  const deposit = await loadDeposit();
  console.log(`賣葡萄前，帳戶金額為: ${deposit}`);
  const newdeposit = deposit + 50; // 賣葡萄後帳戶餘額(deposit)要加50，所以把新的餘額用存入newposit變數中
  await savedeposit(newdeposit); // 呼叫savedeposit函式並把newdeposit當作引數代替savedeposit()的value參數，deposit的值就會被更新
  console.log(`賣葡萄後，帳戶金額為: ${newdeposit}`);
}

async function sellOlives() {
  const deposit = await loadDeposit();
  console.log(`賣橄欖前，帳戶金額為: ${deposit}`);
  const newdeposit = deposit + 50;
  await savedeposit(newdeposit);
  console.log(`賣橄欖後，帳戶金額為: ${newdeposit}`);
}

async function main() {
  // 因為await關鍵字，所以要等到Promise.all()的promise物件變成fulfilled或rejected才會繼續
  // Promise.all()接收的array中的所有promise物件都變成fulfilled狀態的話，那Promise.all()所return的那個promise物件的狀態也會變成fulfilled
  await Promise.all([sellGrapes(), sellOlives()]);
  // 在sellGrapes()或sellOlives()內，我們在loadDeposit()之後，在savedeposit()之前的這個時間差，sellGrapes()和sellOlives()都取得deposit這個共享資源的值了
  // 所以不管哪個先執行，但他們一開始所取得deposit的值就是還沒被更改過的，但這是有時候會發生有時候不會發生，取決於loadDeposit這個隨機數值
  const deposit = await loadDeposit();
  console.log(`賣葡萄與橄欖後的帳戶金額是$${deposit}`);
}

main();

/* 這次發生，並且賣橄欖在前
賣橄欖前，帳戶金額為: 0
賣葡萄前，帳戶金額為: 0
賣橄欖後，帳戶金額為: 50
賣葡萄後，帳戶金額為: 50
賣葡萄與橄欖後的帳戶金額是$50
*/

/* 這次發生，並且賣葡萄在前
賣葡萄前，帳戶金額為: 0
賣橄欖前，帳戶金額為: 0
賣葡萄後，帳戶金額為: 50
賣橄欖後，帳戶金額為: 50
賣葡萄與橄欖後的帳戶金額是$50
*/

/* 這次沒發生，因為在sellGrapes()取得deposit的值(loadDeposit()需要隨機等0~1秒)之前，sellOlives()已經對deposit的值做更改了(savadeposit())
賣橄欖前，帳戶金額為: 0
賣橄欖後，帳戶金額為: 50
賣葡萄前，帳戶金額為: 50
賣葡萄後，帳戶金額為: 100
賣葡萄與橄欖後的帳戶金額是$100
*/
