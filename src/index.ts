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

    const listCountries = document.querySelector('.prefix-dropdown_list') as HTMLElement;

    if (listCountries.firstElementChild) {
      listCountries.removeChild(listCountries.firstElementChild);
    }
    countries.forEach((country) => {
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
      linkOption.addEventListener('click', function (event) {
        setOptionClick(event, this);
      });

      linkOption.appendChild(imgFlag);
      linkOption.appendChild(divPrefix);

      if (listCountries !== null) {
        listCountries.appendChild(linkOption);
      }
      index = index + 1;
    });
  }

  function setCountry(country: Country) {
    const countryCode = document.querySelector('input[name=countryCode]') as HTMLInputElement;
    countryCode.value = country.prefix;

    const selected = document.querySelector('.prefix-dropdown_toggle') as HTMLElement;
    const optionLink = selected.childNodes[0] as HTMLImageElement;
    optionLink.src = country.flag;
    optionLink.alt = country.name + ' Flag';
    const optionPrefix = selected.childNodes[2] as HTMLDivElement;
    optionPrefix.innerHTML = country.prefix;

    const options: NodeListOf<HTMLLinkElement> = document.querySelectorAll('.prefix-dropdown_item');
    options.forEach((option) => {
      if (option.title !== country.name) {
        option.classList.remove('w--current');
      } else {
        option.classList.add('w--current');
        arrowIndex = parseInt(option.getAttribute('data-index') as string);
      }
    });
  }

  function gotoCurrent() {
    const selected = document.querySelector('.w--current') as HTMLDivElement;
    if (selected) {
      if (selected.offsetTop !== 0) {
        const list = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
        list.scrollTop = selected.offsetTop - list.clientHeight / 2.2; // Constants are where the secrets of universe are hidden
      }
      const dataIndex = selected.getAttribute('data-index') as string;
      arrowIndex = parseInt(dataIndex);
    }
  }

  function arrowSelectCountry(direction: string, event: Event) {
    const infoSelected = document.querySelector('.prefix-dropdown_component') as HTMLDivElement;
    if (infoSelected.classList.contains('open')) {
      event.preventDefault();
      if (direction === 'up') {
        const selected = document.getElementById('div' + (arrowIndex - 1));
        if (selected) {
          arrowIndex = arrowIndex - 1;
          document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
            option.classList.remove('arrowSelected');
          });
          const list = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
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
          const list = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
          list.scrollTop = selected.offsetTop - list.clientHeight / 2.2; // Constants are where the secrets of universe are hidden
          selected.classList.add('arrowSelected');
        }
      }
    }
  }

  function toggleList() {
    const infoSelected = document.querySelector('.prefix-dropdown_component') as HTMLDivElement;
    if (!infoSelected.classList.contains('open')) {
      infoSelected.classList.add('open');
      const list = document.querySelector('.prefix-dropdown_list-wrapper') as HTMLDivElement;
      list.style.transition = 'all 0.075s linear';
      list.style.display = 'block';
      const arrow = document.querySelector('.prefix-dropdown_chevron') as HTMLDivElement;
      arrow.style.transition = 'all 0.075s linear';
      arrow.style.transform = 'rotate(180deg)';
    } else {
      hideList();
    }
    gotoCurrent();
  }

  function hideList() {
    const infoSelected = document.querySelector('.prefix-dropdown_component') as HTMLDivElement;
    if (infoSelected.classList.contains('open')) {
      infoSelected.classList.remove('open');
      const list = document.querySelector('.prefix-dropdown_list-wrapper') as HTMLDivElement;
      list.style.transition = 'all 0.075s linear';
      list.style.display = 'none';
      const arrow = document.querySelector('.prefix-dropdown_chevron') as HTMLDivElement;
      arrow.style.transition = 'all 0.075s linear';
      arrow.style.transform = 'rotate(0deg)';
      document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
        option.classList.remove('arrowSelected');
      });
    }
  }

  function setOptionClick(event: MouseEvent, divClicked: HTMLElement) {
    event.preventDefault();
    const divPrefix = divClicked.childNodes[1] as HTMLDivElement;
    const imgFlag = divClicked.childNodes[0] as HTMLImageElement;
    const country = {
      cca2: divPrefix.innerHTML,
      prefix: divPrefix.getAttribute('data-prefix') as string,
      flag: imgFlag.src,
      name: divClicked.title,
    };
    setCountry(country);
    toggleList();
  }

  function setByEnterOrSpace(event: Event) {
    if (document.activeElement === document.querySelector('.prefix-dropdown_toggle')) {
      event.preventDefault();
      const dropDown = document.querySelector('.prefix-dropdown_component') as HTMLDivElement;
      if (dropDown.classList.contains('open')) {
        const current = document.querySelector('.w--current');
        const selected = document.getElementById('div' + arrowIndex) as HTMLDivElement;
        if (current && selected && current !== selected) {
          const divSelected = selected.childNodes[1] as HTMLDivElement;
          const imgSelected = selected.childNodes[0] as HTMLImageElement;
          const country: Country = {
            cca2: divSelected.innerHTML,
            flag: imgSelected.src,
            prefix: divSelected.getAttribute('data-prefix') as string,
            name: selected.getAttribute('title') as string,
          };
          setCountry(country);
        }
      }
    }
    toggleList();
  }

  function gotoLetter(event: KeyboardEvent) {
    const key = event.key as string;
    const infoSelected = document.querySelector('.prefix-dropdown_component') as HTMLDivElement;
    if (infoSelected.classList.contains('open')) {
      if (key.length === 1 && key.match(/[a-z]/i)) {
        const letter = key.toUpperCase();
        let index = 0;
        let found = 0;
        let country = document.getElementById('div' + index);
        while (country && !found) {
          const divLetter = country.childNodes[1] as HTMLDivElement;
          if (letter === divLetter.innerHTML.charAt(0)) {
            arrowIndex = index;
            const list = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
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

  const divToggle = document.querySelector('.prefix-dropdown_toggle') as HTMLDivElement;
  divToggle.setAttribute('tabindex', '1');
  const fieldInput = document.querySelector('.text-field.w-input') as HTMLInputElement;
  fieldInput.setAttribute('tabindex', '2');

  divToggle.addEventListener('click', function () {
    toggleList();
  });

  divToggle.addEventListener('keydown', function (event: KeyboardEvent) {
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
        gotoLetter(event);
        break;
    }
  });
});
