'use strict';

let money = +prompt('Ваш месячный доход?', 6000),
    income = 'freelance',
    addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую'),
    deposit = confirm('Есть ли у вас депозит в банке?'),
    mission = 10000,
    /*period = 12,*/
    expenses1 = prompt('Введите обязательную статью расходов?'),
    amount1 = +prompt('Во сколько это обойдется?', 1000),
    expenses2 = prompt('Введите обязательную статью расходов?'),
    amount2 = +prompt('Во сколько это обойдется?', 1000);

/*Вызовы функции showTypeOf*/
let sowTypeOf = function(data) {
    console.log(data, typeof(data));
};
sowTypeOf(money);
sowTypeOf(income);
sowTypeOf(deposit);

/*Расходы за месяц вызов getExpensesMonth*/
let getExpensesMonth = function(a, b) {
    return a + b;
};
let amountAll = getExpensesMonth(amount1,  amount2);
console.log('Расходы за месяц: ' + amountAll);

/*Вывод возможных расходов в виде массива (addExpenses)*/
console.log(addExpenses.toLowerCase().split(', '));

/*Срок достижения цели в месяцах (результат вызова функции getTargetMonth)*/
let getAccumulatedMonth = function() {
    return money - amountAll;
};

let accumulatedMonth = getAccumulatedMonth();

let getTargetMonth = function() {
    return mission/accumulatedMonth;
};
console.log('Цель будет достигнута за ' + getTargetMonth() + ' месяцев');

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
















