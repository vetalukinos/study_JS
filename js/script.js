'use strict';

//Задаем переменные
let start = document.getElementById('start'),
    cancel = document.getElementById('cancel'),
    incomePlus = document.getElementsByTagName('button')[0],
    expensesPlus = document.getElementsByTagName('button')[1],
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
    periodAmount = document.querySelector('.period-amount'),
    checkInputByRussianWords = document.querySelectorAll('[placeholder="Наименование"]'),
    checkInputByNumbers = document.querySelectorAll('[placeholder="Сумма"]');

//Проверяем на число
let isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

//Проверяем инпуты на русские буквы, символы и пробелы
checkInputByRussianWords.forEach(function(item) {
    item.addEventListener('input', function() {
        this.value = this.value.replace(/[^а-яА-ЯёЁ0-9\+]/, '');
    })
});

//Проверяем инпуты на число
checkInputByNumbers.forEach(function(item) {
    item.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9\+]/, '');
        this.value = this.value.substr(0, 11);
    })
});



/*Функция-конструктор*/
const AppData = function() {

    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.expensesMonth = 0;
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.addExpenses = [];

};

AppData.prototype.start = function() { //Вызывается при нажатии на кнопку "Рассчитать"

    this.budget = +salaryAmount.value;

    //Вызоа всех функций
    this.getExpenses();
    this.getIncome();
    this.getExpensesMonth();
    this.getIncomeMonth();
    this.getAddExpenses();
    this.getAddIncome();
    this.getBudget();
    this.showResult();

    //Снова достаем инпуты
    let inputTypeText = document.querySelectorAll('.calc input[type=text]');
    //Перебираем инпуты через forEach
    inputTypeText.forEach(function(item) {
        item.disabled = true;
    });

};
//Метод, который выводит результаты вычеслений в правую колонку
AppData.prototype.showResult = function() {
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
};

AppData.prototype.reset = function() {

    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.expensesMonth = 0;
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;

    //Снова достаем инпуты
    let inputTypeText = document.querySelectorAll('.calc input[type=text]');

    inputTypeText.forEach(function(item) {
        item.disabled = false;
        item.value = '';
    });

    //Замена кнопок
    cancel.style.display = 'none';
    start.style.display = 'block';
};

//Метод, который получает блок с обязательными расходами
AppData.prototype.addExpensesBlock = function() {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);//Клонируем поля обязательных расходов
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);//Вставляем перед кнопкой
    expensesItems = document.querySelectorAll('.expenses-items');//Находим все элементы
    cloneExpensesItem.querySelector('.expenses-title').value = '';
    cloneExpensesItem.querySelector('.expenses-amount').value = '';
    if (expensesItems.length === 3) {//Если длина = 3, то будем скрывать кнопку
        expensesPlus.style.display = 'none';
    }
};

//Метод, который получает блок с дополнительными доходами
AppData.prototype.addIncomeBlock = function() {
    let cloneIncomeItem = incomeItems[0].cloneNode(true);//Клонируем поля дополнительных доходов
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);//Вставляем перед кнопкой
    incomeItems = document.querySelectorAll('.income-items');//Находим все элементы
    cloneIncomeItem.querySelector('.income-title').value = '';
    cloneIncomeItem.querySelector('.income-amount').value = '';
    if (incomeItems.length === 3) {//Если длина = 3, то будем скрывать кнопку
        incomePlus.style.display = 'none';
    }
};

//Метод, который получает все расходы
AppData.prototype.getExpenses = function() {
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
};

//Метод, который получает все доходы
AppData.prototype.getIncome = function() {
    //Перебираем все элементы с в блоке "Обязательные расходы"
    incomeItems.forEach(function(item, index) {
        let itemIncome = item.querySelector('.income-title').value;
        let cashIncome = item.querySelector('.income-amount').value;
        //Проверка на пустые значения
        if (itemIncome !== '' && cashIncome !== '') {
            this.income[itemIncome + index] = cashIncome;//Ключ - значение
        }
    }, this);
};

//Метод, который получает "Возможные расходы"
AppData.prototype.getAddExpenses = function() {
    let addExpenses = additionalExpensesItem.value.split(',');//Значение поля
    addExpenses.forEach(function(item) {
        item = item.trim();//Убираем пробелы в начале и в конце
        if (item !== '') {//Проверка на пустую строку
            this.addExpenses.push(item);
        }
    }, this);
};

//Метод, который получает "Возможные доходы"
AppData.prototype.getAddIncome = function() {
    additionalIncomeItem.forEach(function(item) {
        let itemValue = item.value.trim();//Убираем пробелы в начале и в конце
        if (itemValue !== '') {//Проверка на пустую строку
            this.addIncome.push(itemValue);
        }
    }, this);
};

AppData.prototype.getInfoDeposit = function() {
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
};

AppData.prototype.getExpensesMonth = function() {
    for(let key in this.expenses) {
        this.expensesMonth += +this.expenses[key];
    }
};

AppData.prototype.getIncomeMonth = function() {
    for(let key in this.income) {
        this.incomeMonth += +this.income[key];
    }
};

AppData.prototype.getBudget = function() {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
};

//Метод, который получает блок с целью
AppData.prototype.getTargetMonth = function() {
    return targetAmount.value / this.budgetMonth;
};

AppData.prototype.getStatusIncome = function() {
    if (this.budgetDay >= 1200) {
        return ('У вас высокий уровень дохода');
    } else if (this.budgetDay < 1200 && this.budgetDay >= 600) {
        return ('У вас средний уровень дохода');
    } else if (this.budgetDay < 600 && this.budgetDay >= 0) {
        return ('К сожалению у вас уровень дохода ниже среднего');
    } else if (this.budgetDay < 0) {
        return ('Что то пошло не так');
    }
};

//Метод, который получает блок с периодом (ползунок)
AppData.prototype.calcPeriod = function() {
    return this.budgetMonth * periodSelect.value;//Умножаем на значение ползунка
};

//Нажатие на кнопку "Рассчитать"
start.disabled = true;

salaryAmount.addEventListener('input', function() {
    if (isNumber(salaryAmount.value)) {
        start.disabled = false;
    } else {
        start.disabled = true;
    }
});

AppData.prototype.eventsListeners = function() {

    const _this = this;

    start.addEventListener('click', _this.start.bind(_this));

    start.addEventListener('click', function() {
        //Замена кнопок
        start.style.display = 'none';
        cancel.style.display = 'block';
        start.disabled = true;
    });

    cancel.addEventListener('click', _this.reset.bind(_this));
    //Нажатие на "+" в поле "Дополнительные доходы"
    incomePlus.addEventListener('click', _this.addIncomeBlock.bind(_this));
    //Нажатие на "+" в поле "Обязательные расходы"
    expensesPlus.addEventListener('click', _this.addExpensesBlock.bind(_this));
    /*Range*/
    periodSelect.addEventListener('input', function() {
        periodAmount.innerHTML = periodSelect.value;
    });
};

//appData создается из функции-конструктора new AppData()
const appData = new AppData();

AppData.prototype.eventsListeners();

console.log(appData);










