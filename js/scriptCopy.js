'use strict';

//Задаем переменные
let start = document.getElementById('start'),
    cancel = document.getElementById('cancel'),
    incomePlus = document.getElementsByTagName('button')[0],
    expensesPlus = document.getElementsByTagName('button')[1],
    checkBox = document.querySelector('#deposit-check'),
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


//Создаем объект
let appData = {
    budget: 0,
    budgetDay: 0,
    budgetMonth: 0,
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expenses: {},
    expensesMonth: 0,
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    addExpenses: [],


    check: function() {
        if (salaryAmount.value !== '') {
            start.removeAttribute('disabled');
        }
    },

    start: function() { //Вызывается при нажатии на кнопку "Рассчитать"
        if (salaryAmount.value === '') {
            start.setAttribute('disabled', 'true');
            return;
        }
        let allInput = document.querySelectorAll('.data input[type=text]');
        allInput.forEach(function(item) {
            item.setAttribute('disabled', 'disabled');
        });
        expensesPlus.setAttribute('disabled', 'disabled');
        incomePlus.setAttribute('disabled', 'disabled');
        start.style.display = 'none';
        cancel.style.display = 'block';

        this.budget = +salaryAmount.value;

        //Вызоа всех функций
        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.getBudget();
        /*this.getInfoDeposit();*/
        this.getStatusIncome();
        this.showResult();

    },

    //Метод, который выводит результаты вычеслений в правую колонку
    showResult: function() {
        //Присваиваем значения методов инпутам из правой колонки
        budgetMonthValue.value = this.budgetMonth;//Поле "Доход за месяц"
        budgetDayValue.value = this.budgetDay;//Поле "Доход за день"
        expensesMonthValue.value = this.expensesMonth;//Поле "Расход за месяц"
        additionalExpensesValue.value = this.addExpenses.join(', ');//Поле "Возможные расходы"(разбиваем на строку)
        additionalIncomeValue.value = this.addIncome.join(', ');//Поле "Возможные доходы"(разбиваем на строку)
        targetMonthValue.value = Math.ceil(this.getTargetMonth());//Поле "Срок достижения цели в месяцах"
        incomePeriodValue.value = this.calcPeriod();//Поле "Накопления за период"

        //Меняет значение в поле “Накопления за период”
        periodSelect.addEventListener('change', function() {
            incomePeriodValue.value = appData.calcPeriod();
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

    //Метод, который получает все расходы
    getExpenses: function() {
        //Перебираем все элементы с в блоке "Обязательные расходы"
        expensesItems.forEach(function(item/*, index*/) {
            //Получаем значение инпутов
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            //Проверка на пустые значения
            if (itemExpenses !== '' && cashExpenses !== '') {
                /*this*/appData.expenses[itemExpenses /*+ index*/] = cashExpenses;//Ключ - значение
            }
        }/*, this*/);
    },

    //Метод, который получает блок с дополнительными доходами
    addIncomeBlock: function() {
        let cloneIncomeItem = incomeItems[0].cloneNode(true);//Клонируем поля дополнительных доходов
        incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);//Вставляем перед кнопкой
        incomeItems = document.querySelectorAll('.income-items');//Находим все элементы

        if (incomeItems.length === 3) {//Если длина = 3, то будем скрывать кнопку
            incomePlus.style.display = 'none';
        }
    },

    //Метод, который получает все доходы
    getIncome: function() {
        //Перебираем все элементы с в блоке "Обязательные расходы"
        incomeItems.forEach(function(item/*, index*/) {
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = item.querySelector('.income-amount').value;

            //Проверка на пустые значения
            if (itemIncome !== '' && cashIncome !== '') {
                /*this*/appData.income[itemIncome/* + index*/] = cashIncome;//Ключ - значение
            }
        }/*, this*/);
        for(let key in this.income) {
            this.incomeMonth += +this.income[key];
        }
    },

    //Метод, который получает "Возможные расходы"
    getAddExpenses: function() {
        let addExpenses = additionalExpensesItem.value.split(',');//Значение поля
        addExpenses.forEach(function(item) {
            item = item.trim();//Убираем пробелы в начале и в конце
            if (item !== '') {//Проверка на пустую строку
                /*this*/appData.addExpenses.push(item);
            }
        }/*, this*/);
    },

    //Метод, который получает "Возможные доходы"
    getAddIncome: function() {
        additionalIncomeItem.forEach(function(item) { //additionalIncomeItem
            let itemValue = item.value.trim();//Убираем пробелы в начале и в конце
            if (itemValue !== '') {//Проверка на пустую строку
                /*this*/appData.addIncome.push(itemValue);
            }
        }/*, this*/);
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

    //Метод, который получает блок с периодом (ползунок)
    calcPeriod: function() {
        return this.budgetMonth * periodSelect.value;//Умножаем на значение ползунка
    },

    reset: function() {

        //Снова достаем инпуты
        let inputTextData = document.querySelectorAll('.data input[type=text]'),
            resultInputAll = document.querySelectorAll('.result input[type=text]');

        inputTextData.forEach(function(elem) {
            elem.value = '';
            elem.removeAttribute('disabled');
            periodSelect.value = '0';
            periodAmount.innerHTML = periodSelect.value;
        });
        resultInputAll.forEach(function(elem) {
            elem.value = '';
        });

        for (let i = 1; i < incomeItems.length; i++ ) {
            incomeItems[i].parentNode.removeChild(incomeItems[i]);
            incomePlus.style.display = 'block';
        }
        for (let i = 1; i < expensesItems.length; i++ ) {
            expensesItems[i].parentNode.removeChild(expensesItems[i]);
            expensesPlus.style.display = 'block';
        }

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

        cancel.style.display = 'none';
        start.style.display = 'block';
        expensesPlus.removeAttribute('disabled');
        incomePlus.removeAttribute('disabled');
        checkBox.checked = false;
    }
};



start.addEventListener('click', appData.start.bind(appData));
//Нажатие на "+" в поле "Дополнительные доходы"
incomePlus.addEventListener('click', appData.addIncomeBlock);
//Нажатие на "+" в поле "Обязательные расходы"
expensesPlus.addEventListener('click', appData.addExpensesBlock);
//Нажатие на кнопку "Рассчитать"
salaryAmount.addEventListener('keyup', appData.check);
/*Cancel*/
cancel.addEventListener('click', appData.reset.bind(appData));

/*Range*/
periodSelect.addEventListener('change', function() {
    periodAmount.innerHTML = periodSelect.value;
});

let addExp = [];
for (let i = 0; i < appData.addExpenses.length; i++) {
    let element = appData.addExpenses[i].trim();
    element = element.charAt(0).toUpperCase() + element.substring(1).toLowerCase();
    addExp.push(element);
}










