import { greetUser } from '$utils/greet';
import type { Country } from '$utils/interfaces';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const name = 'Fabiano Alves';
  greetUser(name);

  const COUNTRIES: Country[] = [];
  const DIV_HEIGHT_AJUST = 2.2;

  const USER_BROWSER_INFORMATION = navigator.language.split('-');
  const USER_COUNTRY_CODE_INDEX = 1;
  const USER_COUNTRY_CODE = USER_BROWSER_INFORMATION[USER_COUNTRY_CODE_INDEX];

  async function setCountryArray() {
    const COUNTRIES_FROM_WEBSERVICE = await getCountriesFromWebservice();
    const COUNTRIES_WITHOUT_SUFIX = ['US', 'PR', 'RU', 'EH', 'KZ', 'VA', 'DO', 'SH'];
    COUNTRIES_FROM_WEBSERVICE.forEach(function (row: {
      idd: { root: string; suffixes: string[] };
      cca2: string;
      flags: { svg: string };
      name: { common: string };
    }) {
      let prefix = '';
      if (row.idd.root) {
        prefix += row.idd.root;
        if (row.idd.suffixes[0] && !COUNTRIES_WITHOUT_SUFIX.includes(row.cca2)) {
          prefix += row.idd.suffixes[0];
        }
      }
      const COUNTRY = {
        code: row.cca2,
        flag: row.flags.svg,
        prefix: prefix,
        name: row.name.common,
      };
      COUNTRIES.push(COUNTRY);
    });
  }

  async function getCountriesFromWebservice() {
    const JSON_COUNTRIES = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags'
    );

    if (JSON_COUNTRIES.ok) {
      return JSON_COUNTRIES.json();
    }
  }

  function sortCountriesArray() {
    let sorted = false;
    while (!sorted) {
      sorted = true;
      let index = 0;
      COUNTRIES.forEach(function () {
        if (index > 0) {
          if (COUNTRIES[index - 1].code > COUNTRIES[index].code) {
            const PLACEHOLDER = COUNTRIES[index];
            COUNTRIES[index] = COUNTRIES[index - 1];
            COUNTRIES[index - 1] = PLACEHOLDER;
            sorted = false;
          }
        }
        index = index + 1;
      });
    }
  }

  function appendAllCountryOptionsToDivList() {
    let index = 0;

    const COUNTRIES_LIST = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;

    if (COUNTRIES_LIST.firstElementChild) {
      COUNTRIES_LIST.removeChild(COUNTRIES_LIST.firstElementChild);
    }

    COUNTRIES.forEach((country) => {
      const OPTION_FLAG_IMAGE = document.createElement('img');
      OPTION_FLAG_IMAGE.src = country.flag;
      OPTION_FLAG_IMAGE.setAttribute('data-element', 'flag');
      OPTION_FLAG_IMAGE.setAttribute('loading', 'lazy');
      OPTION_FLAG_IMAGE.setAttribute('alt', country.name);
      OPTION_FLAG_IMAGE.className = 'prefix-dropdown_flag';

      const OPTION_DIV_PREFIX = document.createElement('div');
      OPTION_DIV_PREFIX.setAttribute('data-element', 'value');
      OPTION_DIV_PREFIX.setAttribute('data-prefix', country.prefix);
      OPTION_DIV_PREFIX.innerHTML = country.code;

      const OPTION_LINK = document.createElement('a');
      OPTION_LINK.setAttribute('data-element', 'item');
      OPTION_LINK.setAttribute('aria-role', 'option');
      OPTION_LINK.setAttribute('aria-selected', 'false');
      OPTION_LINK.setAttribute('aria-label', country.name);
      OPTION_LINK.setAttribute('title', country.name);
      OPTION_LINK.setAttribute('data-index', String(index));
      OPTION_LINK.setAttribute('id', 'div' + index);
      OPTION_LINK.href = '#';
      OPTION_LINK.className = 'prefix-dropdown_item w-inline-block';
      OPTION_LINK.addEventListener('click', function (event) {
        setOptionByClick(event, this as unknown as HTMLLinkElement);
      });

      OPTION_LINK.appendChild(OPTION_FLAG_IMAGE);
      OPTION_LINK.appendChild(OPTION_DIV_PREFIX);

      COUNTRIES_LIST.appendChild(OPTION_LINK);

      index = index + 1;
    });
  }

  function setFocusOnCurrentCountry() {
    const CURRENT_COUNTRY = document.querySelector('.w--current') as HTMLDivElement;
    if (CURRENT_COUNTRY) {
      if (CURRENT_COUNTRY.offsetTop !== 0) {
        const COUNTRIES_LIST = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
        COUNTRIES_LIST.scrollTop =
          CURRENT_COUNTRY.offsetTop - COUNTRIES_LIST.clientHeight / DIV_HEIGHT_AJUST;
      }
      const CURRENT_INDEX = CURRENT_COUNTRY.getAttribute('data-index') as string;
      arrowIndex = parseInt(CURRENT_INDEX);
    }
  }

  function toggleList() {
    const DROP_DOWN_SELECTED_INFORMATION = document.querySelector(
      '.prefix-dropdown_component'
    ) as HTMLDivElement;
    if (!DROP_DOWN_SELECTED_INFORMATION.classList.contains('open')) {
      DROP_DOWN_SELECTED_INFORMATION.classList.add('open');
      const DROP_DOWN_LIST = document.querySelector(
        '.prefix-dropdown_list-wrapper'
      ) as HTMLDivElement;
      DROP_DOWN_LIST.style.transition = 'all 0.075s linear';
      DROP_DOWN_LIST.style.display = 'block';
      const OPEN_CLOSE_ARROW = document.querySelector('.prefix-dropdown_chevron') as HTMLDivElement;
      OPEN_CLOSE_ARROW.style.transition = 'all 0.075s linear';
      OPEN_CLOSE_ARROW.style.transform = 'rotate(180deg)';
    } else {
      hideList();
    }
    setFocusOnCurrentCountry();
  }

  function hideList() {
    const DROP_DOWN_SELECTED_INFORMATION = document.querySelector(
      '.prefix-dropdown_component'
    ) as HTMLDivElement;
    if (DROP_DOWN_SELECTED_INFORMATION.classList.contains('open')) {
      DROP_DOWN_SELECTED_INFORMATION.classList.remove('open');
      const DROP_DOWN_LIST = document.querySelector(
        '.prefix-dropdown_list-wrapper'
      ) as HTMLDivElement;
      DROP_DOWN_LIST.style.transition = 'all 0.075s linear';
      DROP_DOWN_LIST.style.display = 'none';
      const OPEN_CLOSE_ARROW = document.querySelector('.prefix-dropdown_chevron') as HTMLDivElement;
      OPEN_CLOSE_ARROW.style.transition = 'all 0.075s linear';
      OPEN_CLOSE_ARROW.style.transform = 'rotate(0deg)';
      deselectAll();
    }
  }

  function selectCountry(country: Country) {
    const COUNTRY_CODE_INPUT = document.querySelector(
      'input[name=countryCode]'
    ) as HTMLInputElement;
    COUNTRY_CODE_INPUT.value = country.prefix;

    const DIV_SELECTED_INFORMATION = document.querySelector(
      '.prefix-dropdown_toggle'
    ) as HTMLElement;
    const OPTION_LINK = DIV_SELECTED_INFORMATION.childNodes[0] as HTMLImageElement;
    OPTION_LINK.src = country.flag;
    OPTION_LINK.alt = country.name + ' Flag';
    const OPTION_PREFIX = DIV_SELECTED_INFORMATION.childNodes[2] as HTMLDivElement;
    OPTION_PREFIX.innerHTML = country.prefix;

    document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
      const LINK_SELECTED_COUNTRY = option as HTMLLinkElement;
      if (LINK_SELECTED_COUNTRY.title !== country.name) {
        LINK_SELECTED_COUNTRY.classList.remove('w--current');
      } else {
        LINK_SELECTED_COUNTRY.classList.add('w--current');
        arrowIndex = parseInt(LINK_SELECTED_COUNTRY.getAttribute('data-index') as string);
      }
    });
  }

  function selectUserCountry() {
    let index = 0;
    let found = 0;
    let link_country_option = document.getElementById('div' + index) as HTMLLinkElement;
    while (link_country_option && !found) {
      const DIV_TO_COMPARE = link_country_option.childNodes[1] as HTMLDivElement;
      if (USER_COUNTRY_CODE === DIV_TO_COMPARE.innerHTML) {
        deselectAll();
        const COUNTRY_FOUND = setCountryVariable(link_country_option);
        selectCountry(COUNTRY_FOUND);
        found = 1;
      }
      index = index + 1;
      link_country_option = document.getElementById('div' + index) as HTMLLinkElement;
    }
  }

  function setOptionByClick(event: MouseEvent, linkClicked: HTMLLinkElement) {
    event.preventDefault();
    const COUNTRY_SELECTED = setCountryVariable(linkClicked);
    selectCountry(COUNTRY_SELECTED);
    toggleList();
  }

  function setByEnterOrSpace(event: Event) {
    if (document.activeElement === document.querySelector('.prefix-dropdown_toggle')) {
      event.preventDefault();
      const DROP_DOWN_SELECTED_INFORMATION = document.querySelector(
        '.prefix-dropdown_component'
      ) as HTMLDivElement;
      if (DROP_DOWN_SELECTED_INFORMATION.classList.contains('open')) {
        const CURRENT_COUNTRY = document.querySelector('.w--current');
        const COUNTRY_SELECTED = document.getElementById('div' + arrowIndex) as HTMLLinkElement;
        if (CURRENT_COUNTRY && COUNTRY_SELECTED && CURRENT_COUNTRY !== COUNTRY_SELECTED) {
          const COUNTRY = setCountryVariable(COUNTRY_SELECTED);
          selectCountry(COUNTRY);
        }
      }
    }
    toggleList();
  }

  function setCountryVariable(divLink: HTMLLinkElement) {
    const PREFIX_DIV = divLink.childNodes[1] as HTMLDivElement;
    const FLAG_IMG = divLink.childNodes[0] as HTMLImageElement;
    const COUNTRY = {
      code: PREFIX_DIV.innerHTML,
      prefix: PREFIX_DIV.getAttribute('data-prefix') as string,
      flag: FLAG_IMG.src,
      name: divLink.title,
    };
    return COUNTRY;
  }

  function focusOnTypedLetter(event: KeyboardEvent) {
    const KEY_TYPED = event.key as string;
    const DROP_DOWN_SELECTED_INFORMATION = document.querySelector(
      '.prefix-dropdown_component'
    ) as HTMLDivElement;
    if (DROP_DOWN_SELECTED_INFORMATION.classList.contains('open')) {
      if (KEY_TYPED.length === 1 && KEY_TYPED.match(/[a-z]/i)) {
        const LETTER_TYPED = KEY_TYPED.toUpperCase();
        let index = 0;
        let found = 0;
        let link_country_option = document.getElementById('div' + index);
        while (link_country_option && !found) {
          const DIV_TO_COMPARE = link_country_option.childNodes[1] as HTMLDivElement;
          if (LETTER_TYPED === DIV_TO_COMPARE.innerHTML.charAt(0)) {
            arrowIndex = index;
            const COUNTRIES_LIST = document.querySelector(
              '.prefix-dropdown_list'
            ) as HTMLDivElement;
            COUNTRIES_LIST.scrollTop =
              link_country_option.offsetTop - COUNTRIES_LIST.clientHeight / DIV_HEIGHT_AJUST;
            deselectAll();
            link_country_option.classList.add('arrowSelected');
            found = 1;
          }
          index = index + 1;
          link_country_option = document.getElementById('div' + index);
        }
      }
    }
  }

  function arrowSelectCountry(direction: string, event: Event) {
    const DROP_DOWN_SELECTED_INFORMATION = document.querySelector(
      '.prefix-dropdown_component'
    ) as HTMLDivElement;
    if (DROP_DOWN_SELECTED_INFORMATION.classList.contains('open')) {
      event.preventDefault();
      if (direction === 'up') {
        const COUNTRY_SELECTED = document.getElementById(
          'div' + (arrowIndex - 1)
        ) as HTMLDivElement;
        if (COUNTRY_SELECTED) {
          arrowIndex = arrowIndex - 1;
          deselectAll();
          setCountrySeleted(COUNTRY_SELECTED);
        }
      } else {
        const COUNTRY_SELECTED = document.getElementById(
          'div' + (arrowIndex + 1)
        ) as HTMLDivElement;
        if (COUNTRY_SELECTED) {
          arrowIndex = arrowIndex + 1;
          deselectAll();
          setCountrySeleted(COUNTRY_SELECTED);
        }
      }
    }
  }

  function deselectAll() {
    document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
      option.classList.remove('arrowSelected');
    });
  }

  function setCountrySeleted(country_selected: HTMLDivElement) {
    const COUNTRIES_LIST = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
    COUNTRIES_LIST.scrollTop =
      country_selected.offsetTop - COUNTRIES_LIST.clientHeight / DIV_HEIGHT_AJUST;
    country_selected.classList.add('arrowSelected');
  }

  let arrowIndex = 1;

  await setCountryArray();
  sortCountriesArray();
  appendAllCountryOptionsToDivList();
  selectUserCountry();

  const DIV_DROP_DOWN_LIST = document.querySelector('.prefix-dropdown_toggle') as HTMLDivElement;
  DIV_DROP_DOWN_LIST.setAttribute('tabindex', '1');
  const fieldInput = document.querySelector('.text-field.w-input') as HTMLInputElement;
  fieldInput.setAttribute('tabindex', '2');

  DIV_DROP_DOWN_LIST.addEventListener('click', function () {
    toggleList();
  });

  DIV_DROP_DOWN_LIST.addEventListener('keydown', function (event: KeyboardEvent) {
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

  async function submitButtonAction() {
    const PHONE_NUMBER = document.querySelector('[name="phoneNumber"]') as HTMLInputElement;
    const COUNTRY_CODE = document.querySelector('[name="countryCode"]') as HTMLInputElement;

    const response = await fetch('https://webflow.com/api/v1/form/6273d3f75ac01db3e57995c8', {
      method: 'POST',
      body:
        'fields[Phone Number]=' +
        PHONE_NUMBER.value +
        '&fields[countryCode]=' +
        COUNTRY_CODE.value +
        '&name=Phone Form&dolphin=false&teste=false&source=https://secondchancefinsweet.webflow.io/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    });

    if (!response.ok) {
      const FORM_DIV = document.getElementById('phone-form') as HTMLDivElement;
      FORM_DIV.style.display = 'none';
      const FAIL_DIV = document.querySelector('.w-form-fail') as HTMLDivElement;
      FAIL_DIV.style.display = 'block';
    } else {
      const FORM_DIV = document.getElementById('phone-form') as HTMLDivElement;
      FORM_DIV.style.display = 'none';
      const THANKS_DIV = document.querySelector('.w-form-done') as HTMLDivElement;
      THANKS_DIV.style.display = 'block';
    }
  }

  const SUBMIT_BUTTON = document.querySelector('.button.w-button') as HTMLInputElement;
  SUBMIT_BUTTON.addEventListener('click', function (event) {
    event.preventDefault();
    const FORM_ELEMENT = document.getElementById('phone-form') as HTMLFormElement;
    if (FORM_ELEMENT.reportValidity()) {
      hideList();
      this.value = this.getAttribute('data-wait') as string;
      submitButtonAction();
    }
  });
});
