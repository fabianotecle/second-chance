import { greetUser } from '$utils/greet';
import type { Country } from '$utils/interfaces';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const name = 'Fabiano Alves';
  greetUser(name);

  const countries: Country[] = [];

  const language = navigator.language.split('-');
  let myCountry = {
    cca2: language[1],
    flag: '',
    prefix: '',
    name: '',
  };

  const originalArray = await getArrayCountries();
  const ignore = ['US', 'PR', 'RU', 'EH', 'KZ', 'VA', 'DO', 'SH'];

  let arrowIndex = 1;

  async function getArrayCountries() {
    const jsonCoutries = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags'
    );

    if (jsonCoutries.ok) {
      return jsonCoutries.json();
    }
  }

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

  function appendAllOptions(countries: Country[]) {
    let index = 0;

    const listCountries = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;

    if (listCountries.firstElementChild) {
      listCountries.removeChild(listCountries.firstElementChild);
    }
    countries.forEach((country) => {
      const optionFlagImage = document.createElement('img');
      optionFlagImage.src = country.flag;
      optionFlagImage.setAttribute('data-element', 'flag');
      optionFlagImage.setAttribute('loading', 'lazy');
      optionFlagImage.setAttribute('alt', country.name);
      optionFlagImage.className = 'prefix-dropdown_flag';

      const optionDivPrefix = document.createElement('div');
      optionDivPrefix.setAttribute('data-element', 'value');
      optionDivPrefix.setAttribute('data-prefix', country.prefix);
      optionDivPrefix.innerHTML = country.cca2;

      const optionLink = document.createElement('a');
      optionLink.setAttribute('data-element', 'item');
      optionLink.setAttribute('aria-role', 'option');
      optionLink.setAttribute('aria-selected', 'false');
      optionLink.setAttribute('aria-label', country.name);
      optionLink.setAttribute('title', country.name);
      optionLink.setAttribute('data-index', String(index));
      optionLink.setAttribute('id', 'div' + index);
      optionLink.href = '#';
      optionLink.className = 'prefix-dropdown_item w-inline-block';
      optionLink.addEventListener('click', function (event) {
        setOptionClick(event, this);
      });

      optionLink.appendChild(optionFlagImage);
      optionLink.appendChild(optionDivPrefix);

      listCountries.appendChild(optionLink);

      index = index + 1;
    });
  }

  function setFocusOnCurrent() {
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
    setFocusOnCurrent();
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

  function selectCountry(country: Country) {
    const inputCountryCode = document.querySelector('input[name=countryCode]') as HTMLInputElement;
    inputCountryCode.value = country.prefix;

    const selectedOption = document.querySelector('.prefix-dropdown_toggle') as HTMLElement;
    const optionLink = selectedOption.childNodes[0] as HTMLImageElement;
    optionLink.src = country.flag;
    optionLink.alt = country.name + ' Flag';
    const optionPrefix = selectedOption.childNodes[2] as HTMLDivElement;
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
    selectCountry(country);
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
          selectCountry(country);
        }
      }
    }
    toggleList();
  }

  function focusOnTypedLetter(event: KeyboardEvent) {
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

  async function postPhoneForm() {
    const phoneNumber = document.querySelector('[name="phoneNumber"]') as HTMLInputElement;
    const countryCode = document.querySelector('[name="countryCode"]') as HTMLInputElement;

    const response = await fetch(
      '/?phoneNumber=' + phoneNumber.value + '&countryCode=' + countryCode.value
    );

    if (!response.ok) {
      const formTag = document.getElementById('phone-form') as HTMLDivElement;
      formTag.style.display = 'none';
      const failDiv = document.querySelector('.w-form-fail') as HTMLDivElement;
      failDiv.style.display = 'block';
    } else {
      const formTag = document.getElementById('phone-form') as HTMLDivElement;
      formTag.style.display = 'none';
      const thanksDiv = document.querySelector('.w-form-done') as HTMLDivElement;
      thanksDiv.style.display = 'block';
    }
  }

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
  appendAllOptions(countries);
  selectCountry(myCountry);

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
        focusOnTypedLetter(event);
        break;
    }
  });

  const submitButton = document.querySelector('.button.w-button') as HTMLInputElement;
  submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    hideList();
    this.value = this.getAttribute('data-wait') as string;
    postPhoneForm();
  });
});
