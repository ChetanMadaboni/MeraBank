'use strict';


// Mera Bank APP

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  userName: 'js@gmail.com',
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  userName: 'jd@gmail.com',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerLogin = document.querySelector('.login_visibility');
const containerApp1 = document.querySelector('.app_visibility');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// function for displaying movements

//functionality regarding date

const adjustmentMovementDate = function (displayDate, locale) {

  const daysPassed = function (date1, date2) {
    return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  }
  const totalDaysPassed = daysPassed(new Date(), displayDate);
  if (totalDaysPassed === 0) return 'Today';
  if (totalDaysPassed === 1) return 'Yesterday';
  if (totalDaysPassed <= 7) return `${totalDaysPassed} days ago`;
  // const day = `${displayDate.getDay()}`.padStart(2, 0);
  // const month = `${displayDate.getMonth()}`.padStart(2, 0);
  // const year = displayDate.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(displayDate);
}

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? acc.movements.sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const displayDate = new Date(acc.movementsDates[i]);
    const displayDatef = adjustmentMovementDate(displayDate, currentAccount.locale);
    const type = 0 < mov ? 'deposit' : 'withdrawal';
    const formatedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDatef}</div>
          <div class="movements__value">${formatedMov}</div>
        </div>`
    containerMovements.insertAdjacentHTML("beforeend", html);
  })

}

//calculate Display Balances
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements?.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
}

//calculate Dispay Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements?.filter((mov) => 0 < mov).reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements?.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = formatCur(Math.abs(outcomes), acc.locale, acc.currency);

  const intrests = acc.movements?.filter((mov) => 0 < mov).map((deposit) => (deposit * acc.interestRate) / 100).filter((int, i, arr) => i >= 1).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(intrests, acc.locale, acc.currency);

}

const logoutTimer=function(){
  let time=120;
  const tick=function(){
    const min=String(Math.trunc(time/60)).padStart(2,0);
    const sec=String(time%60).padStart(2,0);
    labelTimer.textContent=`${min}:${sec}`;
    
    if(time==0){
      clearTimeout(timer);
      labelWelcome.textContent = `Please login back`;
      containerLogin.style.display = 'flex';
    containerApp.style.display = 'none';
    }

    time--;
    
  }
  tick();
  const timer=setInterval(tick,1000);
  return timer;
}
//functionality for displaying login
let currentAccount,timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(account => account.userName === inputLoginUsername.value)

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log("Login successful");
    containerApp1.style.display = 'visible';
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`;
    containerLogin.style.display = 'none';
    containerApp.style.display = 'grid';
    updateUI(currentAccount);
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    // displaying date using conventional method
    const now = new Date();

    if(timer) clearInterval();

    timer=logoutTimer();

    // const day = `${now.getDay()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = `${now.getMinutes()}`.padStart(2, 0);


    //displaying date using conventional method

    const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // for 12-hour format with AM/PM
    timeZone: 'Asia/Kolkata' // ensures IST time
  };
    // const locale=navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat('en-IN', options).format(now);
  }

})

//functionality for displaying accounts
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferTo = accounts.find(acc => acc.userName === inputTransferTo.value);

  if (amount > 0 && transferTo && currentAccount?.balance >= amount && transferTo?.userName !== currentAccount.userName) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);
    transferTo.movementsDates.push(new Date());
    currentAccount.movementsDates.push(new Date());
    updateUI(currentAccount);
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
    clearInterval(timer)
    timer=logoutTimer();
    console.log("valid transfer");
  } else {
    console.log("invalid transfer data");
  }
})

//updating UI functionality
const updateUI = function (currentAccount) {
  displayMovements(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
}


//functionality for closing account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    containerLogin.style.display = 'grid';
    containerApp.style.display = 'none';
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    console.log(index);
  }
  account.splice(index, 1);
})

//functionality related to loantransfer
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      updateUI(currentAccount)
    }, 2500);
  }
})


//button sort functionality
let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;

})

const overBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
console.log(overBalance);

labelBalance.addEventListener('click', function () {
  const movementsUI = Arrays.from(document.querySelectorAll('.movements__value'),
    (el) => { Number(el.textContent.replace('€', '')) })
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});





const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


