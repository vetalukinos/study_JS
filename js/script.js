'use strict';

let start = document.getElementById('start'),
    btnPlus = document.getElementsByTagName('button'),
    incomePlus = btnPlus[0],
    expensesPlus = btnPlus[1],
    depositCheck = document.querySelector('#deposit-check'),
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-items > .income-title'),
    expensesTitle = document.querySelector('.expenses-items > .expenses-title'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    incomeItems = document.querySelectorAll('.income-items'),
    periodSelect = document.querySelector('.period-select'),//Ползунок
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodAmount = document.querySelector('.period-amount');
    /*incomeItem = document.querySelectorAll('.income-items');*/

let isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

let appData = {
    budget: 0,
    budgetDay: 0,
    budgetMonth: 0,
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expenses: {},
    expensesMonth: 0,
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    start: function() { //Вызывается при нажатии на кнопку "Рассчитать"

        /*Вывод месячного дохода*/
        /*if (salaryAmount.value === '') {
            alert('Ошибка, поле "Месячный доход" должно быть заполнено!');

        }*/

        console.log(this);

        appData.budget = +salaryAmount.value;


        //Вызоа всех функций
        appData.getExpenses();
        appData.getIncome();
        appData.getExpensesMonth();
        appData.getBudget();
        appData.getAddExpenses();
        appData.getAddIncome();
        appData.showResult();
        appData.getBlockStart();
    },
    //Метод, который выводит результаты вычеслений в правую колонку
    showResult: function() {
        //Присваиваем значения методов инпутам из правой колонки
        budgetMonthValue.value = appData.budgetMonth;//Поле "Доход за месяц"
        budgetDayValue.value = appData.budgetDay;//Поле "Доход за день"
        expensesMonthValue.value = appData.expensesMonth;//Поле "Расход за месяц"
        additionalIncomeValue.value = appData.addIncome.join(', ');//Поле "Возможные доходы"(разбиваем на строку)
        additionalExpensesValue.value = appData.addExpenses.join(', ');//Поле "Возможные расходы"(разбиваем на строку)
        targetMonthValue.value = Math.ceil(appData.getTargetMonth());//Поле "Срок достижения цели в месяцах"
        incomePeriodValue.value = appData.calcPeriod();//Поле "Накопления за период"

        //Меняет значение в поле “Накопления за период”
        periodSelect.addEventListener('change', function() {
            incomePeriodValue.value = appData.calcPeriod();
        });
    },
    //Метод, который запрещает нажатие кнопки "Рассчитать" пока поле "Месячный доход" пустое
    getBlockStart: function() {
        if (salaryAmount.value === '') {
            return;
        }
    },
    //Метод, который получает блок с обязательными расходами
    addExpensesBlock: function() {
        let cloneExpensesItem = expensesItems[0].cloneNode(true);//Клонируем поля обязательных расходов
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);//Вставляем перед кнопкой
        expensesItems = document.querySelectorAll('.expenses-items');//Находим все элементы
        if (expensesItems.length === 3) {//Если длина = 3, то будем скрывать кнопку
            expensesPlus.style.display = 'none';
        }
    },
    //Метод, который получает блок с дполнительными доходами
    addIncomeBlock: function() {
        let cloneIncomeItem = incomeItems[0].cloneNode(true);
        incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
        incomeItems = document.querySelectorAll('.income-items');
        if (incomeItems.length === 3) {
            incomePlus.style.display = 'none';
        }
    },
    //Метод, который получает все расходы
    getExpenses: function() {
        //Перебираем все элементы с в блоке "Обязательные расходы"
        expensesItems.forEach(function(item) {
            //Получаем значение инпутов
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            //Проверка на пустые значения
            if (itemExpenses !== '' && cashExpenses !== '') {
                appData.expenses[itemExpenses] = cashExpenses;//Ключ - значение
            }
        });
    },
    //Метод, который получает все доходы
    getIncome: function() {
        //Перебираем все элементы с в блоке "Обязательные расходы"
        incomeItems.forEach(function(item) {
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = item.querySelector('.income-amount').value;
            //Проверка на пустые значения
            if (itemIncome !== '' && cashIncome !== '') {
                appData.expenses[itemIncome] = cashIncome;//Ключ - значение
            }
        });
    },
    //Метод, который получает "Возможные расходы"
    getAddExpenses: function() {
        let addExpenses = additionalExpensesItem.value.split(',');//Значение поля
        addExpenses.forEach(function(item) {
            item = item.trim();//Убираем пробелы в начале и в конце
            if (item !== '') {//Проверка на пустую строку
                appData.addExpenses.push(item);
            }
        });
    },
    //Метод, который получает "Возможные доходы"
    getAddIncome: function() {
        additionalIncomeItem.forEach(function(item) {
            let itemValue = item.value.trim();//Убираем пробелы в начале и в конце
            if (itemValue !== '') {//Проверка на пустую строку
                appData.addIncome.push(itemValue);
            }
        });
    },
    getInfoDeposit: function() {
        appData.deposit = confirm('Есть ли у вас депозит в банке?');
        if (appData.deposit) {
            do {
                appData.percentDeposit = prompt('Какой годовой процент?', '10');
            }
            while (!isNumber(appData.percentDeposit));
            do {
                appData.moneyDeposit = prompt('Какая сумма заложена?', 10000);
            }
            while (!isNumber(appData.moneyDeposit));
        }
    },
    getExpensesMonth: function() {
        for(let key in appData.expenses) {
            appData.expensesMonth += +appData.expenses[key];
        }
    },
    getBudget: function() {
        appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
        appData.budgetDay = Math.floor(appData.budgetMonth / 30);
    },
    //Метод, который получает блок с целью
    getTargetMonth : function() {
        return targetAmount.value / appData.budgetMonth;
    },
    getStatusIncome: function() {
        if (appData.budgetDay >= 1200) {
            return ('У вас высокий уровень дохода');
        } else if (appData.budgetDay < 1200 && appData.budgetDay >= 600) {
            return ('У вас средний уровень дохода');
        } else if (appData.budgetDay < 600 && appData.budgetDay >= 0) {
            return ('К сожалению у вас уровень дохода ниже среднего');
        } else if (appData.budgetDay < 0) {
            return ('Что то пошло не так');
        }
    },
    //Метод, который получает блок с периодом (ползунок)
    calcPeriod: function() {
        return appData.budgetMonth * periodSelect.value;//Умножаем на значение ползунка
    }
};

//Нажатие на кнопку "Рассчитать"
start.addEventListener('click', appData.start);

incomePlus.addEventListener('click', appData.addIncomeBlock);

//Нажатие на "+" в поле "Обязательные расходы"
expensesPlus.addEventListener('click', appData.addExpensesBlock);


/*Range*/
periodSelect.addEventListener('input', function() {
    periodAmount.innerHTML = periodSelect.value;
});


/*Период достижения цели*/
/*if (appData.getTargetMonth() > 0) {
    console.log('Цель будет достигнута за ' + Math.ceil(appData.getTargetMonth()) + ' месяцев');
} else {
    console.log('Цель не будет достигнута');
}*/

