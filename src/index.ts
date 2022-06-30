import { greetUser } from '$utils/greet';
import type { Country } from '$utils/interfaces';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Fabiano Alves';
  greetUser(name);

  const language = navigator.language.split('-');
  let myCountry = {
    cca2: language[1],
    flag: '',
    prefix: '',
    name: '',
  };

  let arrowIndex = 1;

  function sortCountries(countries: Country[]) {
    let sorted = false;
    while (!sorted) {
      sorted = true;
      let index = 0;
      countries.forEach(function () {
        if (index > 0) {
          if (countries[index - 1].cca2 > countries[index].cca2) {
            const aux = countries[index];
            countries[index] = countries[index - 1];
            countries[index - 1] = aux;
            sorted = false;
          }
        }
        index = index + 1;
      });
    }
  }

  function setOptions(countries: Country[]) {
    let index = 0;

    const listCountries = document.querySelector('.prefix-dropdown_list');
    listCountries.removeChild(listCountries.firstElementChild);

    countries.forEach(function (country) {
      const imgFlag = document.createElement('img');
      imgFlag.src = country.flag;
      imgFlag.setAttribute('data-element', 'flag');
      imgFlag.setAttribute('loading', 'lazy');
      imgFlag.setAttribute('alt', country.name);
      imgFlag.className = 'prefix-dropdown_flag';

      const divPrefix = document.createElement('div');
      divPrefix.setAttribute('data-element', 'value');
      divPrefix.setAttribute('data-prefix', country.prefix);
      divPrefix.innerHTML = country.cca2;

      const linkOption = document.createElement('a');
      linkOption.setAttribute('data-element', 'item');
      linkOption.setAttribute('aria-role', 'option');
      linkOption.setAttribute('aria-selected', 'false');
      linkOption.setAttribute('aria-label', country.name);
      linkOption.setAttribute('title', country.name);
      linkOption.setAttribute('data-index', String(index));
      linkOption.setAttribute('id', 'div' + index);
      linkOption.href = '#';
      linkOption.className = 'prefix-dropdown_item w-inline-block';
      linkOption.addEventListener('click', setOptionClick, false);

      linkOption.appendChild(imgFlag);
      linkOption.appendChild(divPrefix);

      listCountries.appendChild(linkOption);

      index = index + 1;
    });
  }

  function setCountry(country: Country) {
    document.querySelector('input[name=countryCode]').value = country.prefix;

    const selected = document.querySelector('.prefix-dropdown_toggle');
    selected.childNodes[0].src = country.flag;
    selected.childNodes[0].alt = country.name + ' Flag';
    selected.childNodes[2].innerHTML = country.prefix;

    const options = document.querySelectorAll('.prefix-dropdown_item');
    options.forEach((option) => {
      if (option.title !== country.name) {
        option.classList.remove('w--current');
      } else {
        option.classList.add('w--current');
        arrowIndex = parseInt(option.getAttribute('data-index'));
      }
    });
  }

  function gotoCurrent() {
    const selected = document.querySelector('.w--current');
    if (selected) {
      if (selected.offsetTop !== 0) {
        const list = document.querySelector('.prefix-dropdown_list');
        list.scrollTop = selected.offsetTop - list.clientHeight / 2.2; // Constants are where the secrets of universe are hidden
      }
      arrowIndex = parseInt(selected.getAttribute('data-index'));
    }
  }

  function arrowSelectCountry(direction: string, event: Event) {
    if (document.querySelector('.prefix-dropdown_component').classList.contains('open')) {
      event.preventDefault();
      if (direction === 'up') {
        const selected = document.getElementById('div' + (arrowIndex - 1));
        if (selected) {
          arrowIndex = arrowIndex + 1;
          document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
            option.classList.remove('arrowSelected');
          });
          const list = document.querySelector('.prefix-dropdown_list');
          list.scrollTop = selected.offsetTop - list.clientHeight / 2.2; // Constants are where the secrets of universe are hidden
          selected.classList.add('arrowSelected');
        }
      } else {
        const selected = document.getElementById('div' + (arrowIndex + 1));
        if (selected) {
          arrowIndex = arrowIndex + 1;
          document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
            option.classList.remove('arrowSelected');
          });
          const list = document.querySelector('.prefix-dropdown_list');
          list.scrollTop = selected.offsetTop - list.clientHeight / 2.2; // Constants are where the secrets of universe are hidden
          selected.classList.add('arrowSelected');
        }
      }
    }
  }

  function toggleList() {
    if (!document.querySelector('.prefix-dropdown_component').classList.contains('open')) {
      document.querySelector('.prefix-dropdown_component').classList.add('open');
      document.querySelector('.prefix-dropdown_list-wrapper').style.transition =
        'all 0.075s linear';
      document.querySelector('.prefix-dropdown_list-wrapper').style.display = 'block';
      document.querySelector('.prefix-dropdown_chevron').style.transition = 'all 0.075s linear';
      document.querySelector('.prefix-dropdown_chevron').style.transform = 'rotate(180deg)';
    } else {
      hideList();
    }
    gotoCurrent();
  }

  function hideList() {
    if (document.querySelector('.prefix-dropdown_component').classList.contains('open')) {
      document.querySelector('.prefix-dropdown_component').classList.remove('open');
      document.querySelector('.prefix-dropdown_list-wrapper').style.transition =
        'all 0.075s linear';
      document.querySelector('.prefix-dropdown_list-wrapper').style.display = 'none';
      document.querySelector('.prefix-dropdown_chevron').style.transition = 'all 0.075s linear';
      document.querySelector('.prefix-dropdown_chevron').style.transform = 'rotate(0deg)';
      document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
        option.classList.remove('arrowSelected');
      });
    }
  }

  function setOptionClick() {
    event.preventDefault();
    const country = {
      cca2: this.childNodes[1].innerHTML,
      prefix: this.childNodes[1].getAttribute('data-prefix'),
      flag: this.childNodes[0].src,
      name: this.title,
    };
    setCountry(country);
    toggleList();
  }

  function setByEnterOrSpace(event: Event) {
    if (document.activeElement === document.querySelector('.prefix-dropdown_toggle')) {
      event.preventDefault();
      if (document.querySelector('.prefix-dropdown_component').classList.contains('open')) {
        const current = document.querySelector('.w--current');
        const selected = document.getElementById('div' + arrowIndex);
        if (current && selected && current !== selected) {
          const country: Country = {
            cca2: selected.childNodes[1].innerHTML,
            flag: selected.childNodes[0].src,
            prefix: selected.childNodes[1].getAttribute('data-prefix'),
            name: selected.getAttribute('title'),
          };
          setCountry(country);
        }
      }
    }
    toggleList();
  }

  function gotoLetter(key: KeyType) {
    if (document.querySelector('.prefix-dropdown_component').classList.contains('open')) {
      if (key.length === 1 && key.match(/[a-z]/i)) {
        const letter = key.toUpperCase();
        let index = 0;
        let found = 0;
        let country = document.getElementById('div' + index);
        while (country && !found) {
          if (letter === country.childNodes[1].innerHTML.charAt(0)) {
            arrowIndex = index;
            const list = document.querySelector('.prefix-dropdown_list');
            list.scrollTop = country.offsetTop - list.clientHeight / 2.2; // Constants are where the secrets of universe are hidden
            document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
              option.classList.remove('arrowSelected');
            });
            country.classList.add('arrowSelected');
            found = 1;
          }
          index = index + 1;
          country = document.getElementById('div' + index);
        }
      }
    }
  }

  fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags')
    .then(function (response) {
      return response.json();
    })
    .then(function (originalArray) {
      const countries: { cca2: string; flag: string; prefix: string; name: string }[] = [];
      const ignore = ['US', 'PR', 'RU', 'EH', 'KZ', 'VA', 'DO', 'SH'];
      originalArray.forEach(function (row: {
        idd: { root: string; suffixes: string[] };
        cca2: string;
        flags: { svg: string };
        name: { common: string };
      }) {
        let prefix = '';
        if (row.idd.root) {
          prefix += row.idd.root;
          if (row.idd.suffixes[0] && !ignore.includes(row.cca2)) {
            prefix += row.idd.suffixes[0];
          }
        }
        const country = {
          cca2: row.cca2,
          flag: row.flags.svg,
          prefix: prefix,
          name: row.name.common,
        };
        countries.push(country);
        if (myCountry.cca2 === country.cca2) {
          myCountry = country;
        }
      });
      sortCountries(countries);
      setOptions(countries);
      setCountry(myCountry);
    })
    .catch(function (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    });

  document.querySelector('.prefix-dropdown_toggle').setAttribute('tabindex', 1);
  document.querySelector('.text-field.w-input').setAttribute('tabindex', 2);

  document.querySelector('.prefix-dropdown_toggle').addEventListener('click', function () {
    toggleList();
  });

  document
    .querySelector('.prefix-dropdown_toggle')
    .addEventListener('blur', function (event: Event) {
      if (event.relatedTarget === null) {
        hideList();
      } else {
        if (event.relatedTarget.classList.contains('prefix-dropdown_item') === false) {
          hideList();
        }
      }
    });

  document
    .querySelector('.prefix-dropdown_toggle')
    .addEventListener('keydown', function (event: Event) {
      switch (event.key) {
        case 'ArrowDown':
          arrowSelectCountry('down', event);
          break;
        case 'ArrowUp':
          arrowSelectCountry('up', event);
          break;
        case 'Enter':
          setByEnterOrSpace(event);
          break;
        case ' ':
          setByEnterOrSpace(event);
          break;
        case 'Escape':
          hideList();
          break;
        case 'Tab':
          hideList();
          break;
        default:
          gotoLetter(event.key);
          break;
      }
    });
});
