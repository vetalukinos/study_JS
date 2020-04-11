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

        this.budget = +salaryAmount.value;

        //Вызоа всех функций
        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getBudget();
        this.getAddExpenses();
        this.getAddIncome();
        this.showResult();
    },
    //Метод, который выводит результаты вычеслений в правую колонку
    showResult: function() {
        //Присваиваем значения методов инпутам из правой колонки
        budgetMonthValue.value = this.budgetMonth;//Поле "Доход за месяц"
        budgetDayValue.value = this.budgetDay;//Поле "Доход за день"
        expensesMonthValue.value = this.expensesMonth;//Поле "Расход за месяц"
        additionalIncomeValue.value = this.addIncome.join(', ');//Поле "Возможные доходы"(разбиваем на строку)
        additionalExpensesValue.value = this.addExpenses.join(', ');//Поле "Возможные расходы"(разбиваем на строку)
        targetMonthValue.value = Math.ceil(this.getTargetMonth());//Поле "Срок достижения цели в месяцах"
        incomePeriodValue.value = this.calcPeriod();//Поле "Накопления за период"

        //Меняет значение в поле “Накопления за период”
        periodSelect.addEventListener('change', () => {
            incomePeriodValue.value = this.calcPeriod();
        });
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
        expensesItems.forEach(function(item, index) {
            //Получаем значение инпутов
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            //Проверка на пустые значения
            if (itemExpenses !== '' && cashExpenses !== '') {
                this.expenses[itemExpenses + index] = cashExpenses;//Ключ - значение
            }
        }, this);
    },
    //Метод, который получает все доходы
    getIncome: function() {
        //Перебираем все элементы с в блоке "Обязательные расходы"
        incomeItems.forEach(function(item, index) {
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = item.querySelector('.income-amount').value;
            //Проверка на пустые значения
            if (itemIncome !== '' && cashIncome !== '') {
                this.expenses[itemIncome + index] = cashIncome;//Ключ - значение
            }
        }, this);
    },
    //Метод, который получает "Возможные расходы"
    getAddExpenses: function() {
        let addExpenses = additionalExpensesItem.value.split(',');//Значение поля
        addExpenses.forEach(function(item) {
            item = item.trim();//Убираем пробелы в начале и в конце
            if (item !== '') {//Проверка на пустую строку
                this.addExpenses.push(item);
            }
        }, this);
    },
    //Метод, который получает "Возможные доходы"
    getAddIncome: function() {
        additionalIncomeItem.forEach(function(item) {
            let itemValue = item.value.trim();//Убираем пробелы в начале и в конце
            if (itemValue !== '') {//Проверка на пустую строку
                this.addIncome.push(itemValue);
            }
        }, this);
    },
    getInfoDeposit: function() {
        this.deposit = confirm('Есть ли у вас депозит в банке?');
        if (this.deposit) {
            do {
                this.percentDeposit = prompt('Какой годовой процент?', '10');
            }
            while (!isNumber(this.percentDeposit));
            do {
                this.moneyDeposit = prompt('Какая сумма заложена?', 10000);
            }
            while (!isNumber(this.moneyDeposit));
        }
    },
    getExpensesMonth: function() {
        for(let key in this.expenses) {
            this.expensesMonth += +this.expenses[key];
        }
    },
    getBudget: function() {
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    },
    //Метод, который получает блок с целью
    getTargetMonth : function() {
        return targetAmount.value / this.budgetMonth;
    },
    getStatusIncome: function() {
        if (this.budgetDay >= 1200) {
            return ('У вас высокий уровень дохода');
        } else if (this.budgetDay < 1200 && this.budgetDay >= 600) {
            return ('У вас средний уровень дохода');
        } else if (this.budgetDay < 600 && this.budgetDay >= 0) {
            return ('К сожалению у вас уровень дохода ниже среднего');
        } else if (this.budgetDay < 0) {
            return ('Что то пошло не так');
        }
    },
    //Метод, который получает блок с периодом (ползунок)
    calcPeriod: function() {
        return this.budgetMonth * periodSelect.value;//Умножаем на значение ползунка
    }
};

start.disabled = true;

//Нажатие на кнопку "Рассчитать"
salaryAmount.addEventListener('input', function() {
    if (isNumber(salaryAmount.value)) {
        start.disabled = false;
    } else {
        start.disabled = true;
    }
});

start.addEventListener('click', appData.start.bind(appData));

incomePlus.addEventListener('click', appData.addIncomeBlock.bind(appData));

//Нажатие на "+" в поле "Обязательные расходы"
expensesPlus.addEventListener('click', appData.addExpensesBlock.bind(appData));


/*Range*/
periodSelect.addEventListener('input', function() {
    periodAmount.innerHTML = periodSelect.value;
});




/*Период достижения цели*/
/*if (this.getTargetMonth() > 0) {
    console.log('Цель будет достигнута за ' + Math.ceil(this.getTargetMonth()) + ' месяцев');
} else {
    console.log('Цель не будет достигнута');
}*/

