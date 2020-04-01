'use strict';

let isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

let money,
    income = 'freelance',
    addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую'),
    deposit = confirm('Есть ли у вас депозит в банке?'),
    mission = 50000,
    period = 3;

let start = function() {
    do {
        money = prompt('Ваш месячный доход?');
    }
    while (!isNumber(money));
};

start();

/*Вызовы функции showTypeOf*/
let sowTypeOf = function(item) {
    console.log(typeof(item));
};
sowTypeOf(money);
sowTypeOf(income);
sowTypeOf(deposit);

let expenses = [];

/*Вывод возможных расходов в виде массива (addExpenses)*/
console.log(addExpenses.toLowerCase().split(', '));

/*Расходы за месяц вызов getExpensesMonth*/
let getExpensesMonth = function() {
    let sum = 0;
    let cont;

    for (let i = 0; i < 2; i++) {

        expenses[i] = prompt('Введите обязательную статью расходов?');

        do {
            cont = prompt('Во сколько это обойдется?');
        }
        while (!isNumber(cont));
        sum += +cont;
    }
    console.log(expenses);
    return sum;
};

let expensesAmount = getExpensesMonth();

console.log('Расходы за месяц: ' + expensesAmount);

/*Срок достижения цели в месяцах (результат вызова функции getTargetMonth)*/
let getAccumulatedMonth = function() {
    return money - expensesAmount;
};

let accumulatedMonth = getAccumulatedMonth();

let getTargetMonth = function() {
    return mission/accumulatedMonth;
};
if (getTargetMonth > 0) {
    console.log('Цель будет достигнута за ' + getTargetMonth() + ' месяцев');
} else {
    console.log('Цель не будет достигнута');
}

/*Бюджет на день (budgetDay)*/
let budgetDay = accumulatedMonth/30;
console.log('Бюджет на день: ' + Math.floor(budgetDay));

/*Вызов функции getStatusIncome*/
let getStatusIncome = function() {
    if (budgetDay >= 1200) {
        return ('У вас высокий уровень дохода');
    } else if (budgetDay < 1200 && budgetDay >= 600) {
        return ('У вас средний уровень дохода');
    } else if (budgetDay < 600 && budgetDay >= 0) {
        return ('К сожалению у вас уровень дохода ниже среднего');
    } else if (budgetDay < 0) {
        return ('Что то пошло не так');
    }
};
console.log(getStatusIncome());










