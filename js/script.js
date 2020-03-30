'use strict';

let money = 6000;
console.log(typeof money);

let income = 'freelance';
console.log(typeof income);

let addExpenses = 'Internet, Taxi, Communal';
console.log(addExpenses.length);
console.log(addExpenses.toLowerCase().split(', '));

let deposit = true;
console.log(typeof deposit);

let mission = 10000;

let period = 12;

console.log('Период равен ' + period + ' месяцев');

console.log('Цель заработать ' + mission + ' долларов');

let budgetDay = money/30;
console.log(budgetDay);

/*Lesson 03*/
money = prompt('Ваш месячный доход?');

addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');

deposit = confirm('Есть ли у вас депозит в банке?');
console.log(deposit);

let expenses1 = prompt('Введите обязательную статью расходов?');
let expenses2 = prompt('Введите обязательную статью расходов?');

let amount1 = +prompt('Во сколько это обойдется?');
let amount2 = +prompt('Во сколько это обойдется?');

let budgetMonth = (Number(money)) - ((Number(amount1)) + (Number(amount2)));
console.log('Бюджет на месяц: ' + budgetMonth);

let missionMonth = mission/budgetMonth;
console.log('Цель будет достигнута за ' + Math.ceil(missionMonth) + ' месяцев');

budgetDay = budgetMonth/30;
console.log('Бюджет на день: ' + Math.floor(budgetDay));

if (budgetDay >= 1200) {
    console.log('У вас высокий уровень дохода');
} else if (budgetDay < 1200 && budgetDay >= 600) {
    console.log('У вас средний уровень дохода');
} else if (budgetDay < 600 && budgetDay >= 0) {
    console.log('К сожалению у вас уровень дохода ниже среднего');
} else if (budgetDay < 0) {
    console.log('Что то пошло не так');
}













