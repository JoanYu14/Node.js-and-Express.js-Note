let max = 1000000;

// 定義isPrime函式，isPrime有一個參數n，判斷n是否為質數
function isPrime(n) {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i == 0) {
      return false;
    }
  }

  return n > 1;
}

// 定義random是一個函式，他有一個參數叫max
// Math.random()會return一個0~1之間(不包括1)的隨機數字
// 乘假如他是1000的話，就會把Math.random()乘上1000再取整數
const random = (max) => Math.floor(Math.random() * max);

// 定義一個叫做 generraterimes的函式，它的功能就是要產生一定數量(我們給quota參數的值)的質數
function generratePrimes(quota) {
  // 找到的質數都要放進Primes陣列裡面
  const primes = [];

  // 如果Primes陣列內的元素還小於quota(我們要找幾個質數)的話就繼續while迴圈
  while (primes.length < quota) {
    // 我們會從0~999999隨機選一個整數(用我們定義的random函式)，並存到candidata變數中
    const candidata = random(max);
    if (isPrime(candidata)) {
      // 如果candidata是一個質數的話就新增到Primes陣列裡面
      primes.push(candidata);
    }
  }
  return primes;
}

// 用querySelector選取div標籤中id為output的element並存到output變數內
const output = document.querySelector("div#output");
// // 用querySelector選取button標籤中id為generate的element並存到generate變數內
const button = document.querySelector("button#generate");

// 對button這個element監聽點擊事件
button.addEventListener("click", (e) => {
  // 如果button被點擊的話
  // 就用querySelector選取id為number的element，並存到quota裡面
  const quota = document.querySelector("#number");
  // 呼叫generratePrimes，並傳入quota這個element的值，就是去找quota個的質數
  const primes = generratePrimes(quota.value);
  // 找到的質數會存在primes陣列內，所以讓output的內容變成primes陣列
  output.innerHTML = primes;
});
