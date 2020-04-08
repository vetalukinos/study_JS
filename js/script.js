'use strict';

const books = document.querySelectorAll('.books'),
    book = document.querySelectorAll('.book'),
    adv = document.querySelectorAll('.adv'),
    ul = document.querySelectorAll('.book > ul'),
    secondLi = book[0].querySelectorAll('.book > ul > li'),
    fifthLi = book[5].querySelectorAll('.book > ul > li'),
    sixthLi = book[2].querySelectorAll('.book > ul > li'),
    newTitle = document.createElement('li');

books[0].append(book[2]);
books[0].prepend(book[1]);
book[3].before(book[4]);

document.body.style.backgroundImage = 'url("../image/you-dont-know-js.jpg")';

document.getElementsByClassName('book')[2].querySelector('a').textContent = 'Книга 3. this и Прототипы Объектов';

adv[0].remove();

/*Second Book*/
secondLi[10].before(secondLi[2]);
secondLi[9].before(secondLi[7]);
secondLi[3].after(secondLi[6]);
secondLi[6].after(secondLi[8]);

/*Fifth Book*/
fifthLi[1].after(fifthLi[9]);
fifthLi[9].after(fifthLi[3]);
fifthLi[3].after(fifthLi[4]);
fifthLi[8].before(fifthLi[5]);

/*Sixth Book*/
newTitle.textContent = 'Глава 8: За пределами ES6';
ul[2].append(newTitle);
sixthLi[9].before(newTitle);

console.log(books);
console.log(book);
console.log(ul);
console.log(secondLi);
console.log(fifthLi);
console.log(sixthLi);