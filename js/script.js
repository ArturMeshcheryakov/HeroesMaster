window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const start = () => {
    getData(
      (data) => {
        showCard(data);
        showFilter(data);
        filter(data);
      },
      (error) => {
        console.error(error);
      });
  };

  const showCard = (data) => {
    const cards = document.querySelector('.cards');

    data.forEach((item) => {
      const cardItem = document.createElement('div');
      const image = item.photo.replace(/\/$/gi, '');

      let name = item.name;
      let species = item.species;
      let gender = item.gender;
      let birthDay = item.birthDay;
      let deathDay = item.deathDay;
      let status = item.status;
      let actors = item.actors;
      let movies = item.movies;

      if (!name) name = 'is unknown';
      if (!species) species = 'is unknown';
      if (!gender) gender = 'is unknown';
      if (!birthDay) birthDay = 'is unknown';
      if (!deathDay) deathDay = 'is unknown';
      if (!status) status = 'is unknown';
      if (!actors) actors = 'is unknown';
      if (!movies) movies = 'is unknown';

      cardItem.classList.add('col-4');
      cardItem.innerHTML = `
        <div class="card__item">
            <div class="card__name">${name}</div>
            <div class="card__photo">
                <img src="${image}" alt="${name}">
            </div>
            <div class="card__species card__item-df">
                <div>species:</div>
                <div>${species}</div>
            </div>
            <div class="card__gender card__item-df">
                <div>gender:</div>
                <div>${gender}</div>
            </div>
            <div class="card__birthDay card__item-df">
                <div>birthDay</div>
                <div>${birthDay}</div>
              </div>
            <div class="card__deathDay card__item-df">
              <div>deathDay:</div>
              <div>${deathDay}</div>
            </div>
            <div class="card__status card__item-df">
              <div>status:</div>
              <div>${status}</div>
            </div>
            <div class="card__actors card__item-df">
              <div>actors:</div>
              <div>${actors}</div>
            </div>
            <div class="card__movies card__item-df">
              <div>movies:</div>
              <div>${movies}</div>
            </div>
        </div> 
      `
      cards.append(cardItem);
    });
  };

  const showFilter = (data) => {
    const filterWrap = document.querySelector('.filter__wrap');
    let moviesArr = [];
    let actorsArr = [];
    let uniqueArray = [];
    let filterObj = {};

    const unique = (array) => {
      uniqueArray = array.filter(function (item, pos) {
        return array.indexOf(item) == pos;
      });
    };

    data.forEach((item) => {
      if (item.movies) {
        moviesArr.push(...item.movies);
        unique(moviesArr);
        filterObj['movies'] = uniqueArray;
      }
      if (item.actors) {
        actorsArr.push(item.actors);
        unique(actorsArr);
        filterObj['actors'] = uniqueArray;
      }
    });

    for (let key in filterObj) {
      const value = filterObj[key];
      const filterItem = document.createElement('div');
      const filterItemTitle = document.createElement('div');

      filterItem.classList.add('filter__item');
      filterWrap.prepend(filterItem);

      filterItemTitle.classList.add('filter__item-title');
      filterItemTitle.textContent = key;
      filterItem.prepend(filterItemTitle);

      value.forEach((item, index) => {
        const myCheck = document.createElement('div');
        const class1 = 'my__check';
        const class2 = 'filter__item-check';
        const classes = class1.split(' ').concat(class2);

        myCheck.classList.add(...classes);

        myCheck.innerHTML = `
          <input type="checkbox" id="inp__check-${key}-${index}" class="my__check-inp filter__item-check__inp" value="${item}">
          <label for="inp__check-${key}-${index}" class="my__check-label filter__item-check__label">${item}</label>
      `;
        filterItem.append(myCheck);
      });
    }
  };

  const filter = (data) => {
    const filterWrap = document.querySelector('.filter__wrap');
    const dataObj = data;
    let filterArray = [];

    filterWrap.addEventListener('click', (event) => {
      let target = event.target;
      const input = target.closest('.filter__item-check__inp');

      if (input) {
        const loaded = document.createElement('div');
        const cards = document.querySelector('.cards');
        const cardItem = cards.querySelectorAll('.col-4');
        let index = filterArray.indexOf(input.value);

        if (input.checked === true) {
          filterArray.push(input.value);
        } else {
          if (index !== -1) filterArray.splice(index, 1);
        }

        loaded.classList.add('loaded');
        cards.append(loaded);

        loaded.innerHTML = `
            <div class="sk-double-bounce">
                <div class="sk-child sk-double-bounce-1"></div>
                <div class="sk-child sk-double-bounce-2"></div>
            </div>
          `;

        cardItem.forEach((item) => {
          item.remove();
        });

        setTimeout(function () {
          if (filterArray.length > 0 && filterArray !== []) {
            let checkArray = [];
            let uniqueArray = [];

            loaded.remove();
            dataObj.forEach((item) => {
              filterArray.forEach((filterItem) => {
                if ((item.actors && item.actors === filterItem) || (item.movies && item.movies.includes(filterItem))) {
                  checkArray.push(...[item]);
                  uniqueArray = checkArray.filter(function (item, pos) {
                    return checkArray.indexOf(item) == pos;
                  });
                }
              });
            });

            showCard(uniqueArray);
          } else {
            loaded.remove();
            showCard(dataObj);
          }
        }, 1500);

        scrollTop();
      }
    });
  };

  const getData = (outputData, errorData) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', () => {
      if (request.readyState !== 4) return;
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        outputData(data);
      } else {
        errorData(request.status);
      }
    });

    request.open('GET', './dbHeroes.json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send();
  };

  const scrollTop = () => {
    let scrollStep = window.pageYOffset / 40;
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -(scrollStep));
      setTimeout(scrollTop, 0);
    }
  };

  start();
});
