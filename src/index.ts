import { greetUser } from '$utils/greet';
import type { Country } from '$utils/interfaces';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const name = 'Fabiano Alves';
  greetUser(name);

  const countries: Country[] = [];

  async function setCountryArray() {
    const countriesFromWebservice = await getCountriesFromWebservice();
    const countriesWithoutPhoneSufix = ['US', 'PR', 'RU', 'EH', 'KZ', 'VA', 'DO', 'SH'];
    countriesFromWebservice.forEach(function (row: {
      idd: { root: string; suffixes: string[] };
      cca2: string;
      flags: { svg: string };
      name: { common: string };
    }) {
      let prefix = row.idd.root;
      const rowCountryCode = row.cca2;
      if (prefix) {
        const sufix = row.idd.suffixes[0];
        if (sufix && !countriesWithoutPhoneSufix.includes(rowCountryCode)) {
          prefix += sufix;
        }
      }
      const country = {
        code: rowCountryCode,
        flag: row.flags.svg,
        prefix: prefix,
        name: row.name.common,
      };
      countries.push(country);
    });
  }

  const URL_JSON_COUNTRIES_WEBSERVICE =
    'https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags';
  const URL_LOCAL_JSON_US = './json/us-country.json';

  let userCoutryCode = getUserCountry();

  async function getCountriesFromWebservice() {
    try {
      const jsonCountriesFromWebservice = await fetch(URL_JSON_COUNTRIES_WEBSERVICE);
      return jsonCountriesFromWebservice.json();
    } catch (error) {
      userCoutryCode = 'US';
      const jsonCountriesFromWebservice = await fetch(URL_LOCAL_JSON_US);
      return jsonCountriesFromWebservice.json();
    }
  }

  function sortCountriesArray() {
    let sorted = false;
    while (!sorted) {
      sorted = true;
      let index = 0;
      countries.forEach(function () {
        if (index > 0) {
          const previousIndex = index - 1;
          if (countries[previousIndex].code > countries[index].code) {
            const placeholder = countries[index];
            countries[index] = countries[previousIndex];
            countries[previousIndex] = placeholder;
            sorted = false;
          }
        }
        index = index + 1;
      });
    }
  }

  await setCountryArray();
  sortCountriesArray();

  function clearDivCountryList() {
    const divCountryList = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
    if (divCountryList.firstElementChild) {
      divCountryList.removeChild(divCountryList.firstElementChild);
    }
  }

  function appendAllCountryOptionsToDivCountryList() {
    let index = 0;

    const divCountryList = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;

    countries.forEach((country) => {
      const optionFlagImage = setFlagImageTag(country);
      const optionDivPrefix = setOptionDivPrefix(country);
      const optionLink = setOptionLinkTag(country, index);

      optionLink.appendChild(optionFlagImage);
      optionLink.appendChild(optionDivPrefix);

      divCountryList.appendChild(optionLink);

      index = index + 1;
    });
  }

  function setFlagImageTag(country: Country) {
    const optionFlagImage = document.createElement('img');
    optionFlagImage.src = country.flag;
    optionFlagImage.setAttribute('data-element', 'flag');
    optionFlagImage.setAttribute('loading', 'lazy');
    optionFlagImage.setAttribute('alt', country.name);
    optionFlagImage.className = 'prefix-dropdown_flag';
    return optionFlagImage;
  }

  function setOptionDivPrefix(country: Country) {
    const optionDivPrefix = document.createElement('div');
    optionDivPrefix.setAttribute('data-element', 'value');
    optionDivPrefix.setAttribute('data-prefix', country.prefix);
    optionDivPrefix.innerHTML = country.code;
    return optionDivPrefix;
  }

  function setOptionLinkTag(country: Country, index: number) {
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
      setOptionByClick(event, this as unknown as HTMLLinkElement);
    });
    return optionLink;
  }

  clearDivCountryList();
  appendAllCountryOptionsToDivCountryList();

  let arrowIndex = 1;

  function selectCountry(country: Country) {
    setCountryInputValue(country);
    setSelectedInformationDiv(country);
    setListCurrentPosition(country);
  }

  function setCountryInputValue(country: Country) {
    const countryCodeInput = document.querySelector('input[name=countryCode]') as HTMLInputElement;
    countryCodeInput.value = country.prefix;
  }

  function setSelectedInformationDiv(country: Country) {
    const divSelectedInformation = document.querySelector('.prefix-dropdown_toggle') as HTMLElement;
    const optionLink = divSelectedInformation.childNodes[0] as HTMLImageElement;
    optionLink.src = country.flag;
    optionLink.alt = country.name + ' Flag';
    const optionPrefix = divSelectedInformation.childNodes[2] as HTMLDivElement;
    optionPrefix.innerHTML = country.prefix;
  }

  function setListCurrentPosition(country: Country) {
    document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
      const linkSelectedCountry = option as HTMLLinkElement;
      if (linkSelectedCountry.title !== country.name) {
        linkSelectedCountry.classList.remove('w--current');
      } else {
        linkSelectedCountry.classList.add('w--current');
        arrowIndex = parseInt(linkSelectedCountry.getAttribute('data-index') as string);
      }
    });
  }

  function getUserCountry() {
    const userBrowserInformation = navigator.language.split('-');
    const USER_COUNTRY_CODE_INDEX = 1;
    return userBrowserInformation[USER_COUNTRY_CODE_INDEX];
  }

  function selectUserCountry() {
    let index = 0;
    let found = false;
    let linkCountryOption = document.getElementById('div' + index) as HTMLLinkElement;
    while (linkCountryOption && !found) {
      const divToCompare = linkCountryOption.childNodes[1] as HTMLDivElement;
      if (userCoutryCode === divToCompare.innerHTML) {
        deselectAll();
        const countryFound = setCountryVariable(linkCountryOption);
        selectCountry(countryFound);
        found = true;
      }
      index = index + 1;
      linkCountryOption = document.getElementById('div' + index) as HTMLLinkElement;
    }
  }

  function deselectAll() {
    document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
      option.classList.remove('arrowSelected');
    });
  }

  selectUserCountry();

  const DIV_HEIGHT_AJUST = 2.2;

  function setFocusOnCurrentCountry() {
    const currentCountry = document.querySelector('.w--current') as HTMLDivElement;
    if (currentCountry) {
      if (currentCountry.offsetTop !== 0) {
        const countryList = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
        countryList.scrollTop =
          currentCountry.offsetTop - countryList.clientHeight / DIV_HEIGHT_AJUST;
      }
      const currentIndex = currentCountry.getAttribute('data-index') as string;
      arrowIndex = parseInt(currentIndex);
    }
  }

  function toggleList() {
    const dropDownSelectedInformation = document.querySelector(
      '.prefix-dropdown_component'
    ) as HTMLDivElement;
    if (!dropDownSelectedInformation.classList.contains('open')) {
      dropDownSelectedInformation.classList.add('open');
      showList();
      setChevronIconUp();
    } else {
      hideList();
    }
    setFocusOnCurrentCountry();
  }

  function hideList() {
    const dropDownSelectedInformation = document.querySelector(
      '.prefix-dropdown_component'
    ) as HTMLDivElement;
    if (dropDownSelectedInformation.classList.contains('open')) {
      dropDownSelectedInformation.classList.remove('open');
      const dropDownList = document.querySelector(
        '.prefix-dropdown_list-wrapper'
      ) as HTMLDivElement;
      dropDownList.style.transition = 'all 0.075s linear';
      dropDownList.style.display = 'none';
      setChevronIconDown();
      deselectAll();
    }
  }

  function showList() {
    const dropDownList = document.querySelector('.prefix-dropdown_list-wrapper') as HTMLDivElement;
    dropDownList.style.transition = 'all 0.075s linear';
    dropDownList.style.display = 'block';
  }

  function setChevronIconUp() {
    const openCloseArrow = document.querySelector('.prefix-dropdown_chevron') as HTMLDivElement;
    openCloseArrow.style.transition = 'all 0.075s linear';
    openCloseArrow.style.transform = 'rotate(180deg)';
  }

  function setChevronIconDown() {
    const openCloseArrow = document.querySelector('.prefix-dropdown_chevron') as HTMLDivElement;
    openCloseArrow.style.transition = 'all 0.075s linear';
    openCloseArrow.style.transform = 'rotate(0deg)';
  }

  function setOptionByClick(event: MouseEvent, linkClicked: HTMLLinkElement) {
    event.preventDefault();
    const countrySelected = setCountryVariable(linkClicked);
    selectCountry(countrySelected);
    toggleList();
  }

  function setByEnterOrSpace(event: Event) {
    if (document.activeElement === document.querySelector('.prefix-dropdown_toggle')) {
      event.preventDefault();
      const dropDownSelectedInformation = document.querySelector(
        '.prefix-dropdown_component'
      ) as HTMLDivElement;
      if (dropDownSelectedInformation.classList.contains('open')) {
        const currentCountry = document.querySelector('.w--current');
        const countrySelected = document.getElementById('div' + arrowIndex) as HTMLLinkElement;
        if (currentCountry && countrySelected && currentCountry !== countrySelected) {
          const country = setCountryVariable(countrySelected);
          selectCountry(country);
        }
      }
    }
    toggleList();
  }

  function setCountryVariable(divLink: HTMLLinkElement) {
    const prefixDiv = divLink.childNodes[1] as HTMLDivElement;
    const flagImage = divLink.childNodes[0] as HTMLImageElement;
    const country = {
      code: prefixDiv.innerHTML,
      prefix: prefixDiv.getAttribute('data-prefix') as string,
      flag: flagImage.src,
      name: divLink.title,
    };
    return country;
  }

  function focusOnTypedLetter(event: KeyboardEvent) {
    const keyTyped = event.key as string;
    const dropDownSelectedInformation = document.querySelector(
      '.prefix-dropdown_component'
    ) as HTMLDivElement;
    if (dropDownSelectedInformation.classList.contains('open')) {
      if (keyTyped.length === 1 && keyTyped.match(/[a-z]/i)) {
        const letterTyped = keyTyped.toUpperCase();
        let index = 0;
        let found = 0;
        let link_country_option = document.getElementById('div' + index);
        while (link_country_option && !found) {
          const divToCompare = link_country_option.childNodes[1] as HTMLDivElement;
          if (letterTyped === divToCompare.innerHTML.charAt(0)) {
            arrowIndex = index;
            const countryList = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
            countryList.scrollTop =
              link_country_option.offsetTop - countryList.clientHeight / DIV_HEIGHT_AJUST;
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

  function arrowSelectCountry(event: Event, direction: string) {
    const dropDownSelectedInformation = document.querySelector(
      '.prefix-dropdown_component'
    ) as HTMLDivElement;
    if (dropDownSelectedInformation.classList.contains('open')) {
      event.preventDefault();
      if (direction === 'up') {
        const countrySelected = document.getElementById('div' + (arrowIndex - 1)) as HTMLDivElement;
        if (countrySelected) {
          arrowIndex = arrowIndex - 1;
          deselectAll();
          setCountrySeleted(countrySelected);
        }
      } else {
        const countrySelected = document.getElementById('div' + (arrowIndex + 1)) as HTMLDivElement;
        if (countrySelected) {
          arrowIndex = arrowIndex + 1;
          deselectAll();
          setCountrySeleted(countrySelected);
        }
      }
    }
  }

  function setCountrySeleted(country_selected: HTMLDivElement) {
    const countryList = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
    countryList.scrollTop =
      country_selected.offsetTop - countryList.clientHeight / DIV_HEIGHT_AJUST;
    country_selected.classList.add('arrowSelected');
  }

  const divDropDownList = document.querySelector('.prefix-dropdown_toggle') as HTMLDivElement;
  divDropDownList.setAttribute('tabindex', '1');
  const fieldInput = document.querySelector('.text-field.w-input') as HTMLInputElement;
  fieldInput.setAttribute('tabindex', '2');

  divDropDownList.addEventListener('click', function () {
    toggleList();
  });

  divDropDownList.addEventListener('keydown', function (event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        arrowSelectCountry(event, 'down');
        break;
      case 'ArrowUp':
        arrowSelectCountry(event, 'up');
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
    const phoneNumber = document.querySelector('[name="phoneNumber"]') as HTMLInputElement;
    const countryCode = document.querySelector('[name="countryCode"]') as HTMLInputElement;

    const response = await fetch('https://webflow.com/api/v1/form/6273d3f75ac01db3e57995c8', {
      method: 'POST',
      body:
        'fields[Phone Number]=' +
        phoneNumber.value +
        '&fields[countryCode]=' +
        countryCode.value +
        '&name=Phone Form&dolphin=false&teste=false&source=https://secondchancefinsweet.webflow.io/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    });

    if (!response.ok) {
      const formDiv = document.getElementById('phone-form') as HTMLDivElement;
      formDiv.style.display = 'none';
      const failDiv = document.querySelector('.w-form-fail') as HTMLDivElement;
      failDiv.style.display = 'block';
    } else {
      const formDiv = document.getElementById('phone-form') as HTMLDivElement;
      formDiv.style.display = 'none';
      const thanksDiv = document.querySelector('.w-form-done') as HTMLDivElement;
      thanksDiv.style.display = 'block';
    }
  }

  const subimitButton = document.querySelector('.button.w-button') as HTMLInputElement;
  subimitButton.addEventListener('click', function (event) {
    event.preventDefault();
    const formElement = document.getElementById('phone-form') as HTMLFormElement;
    if (formElement.reportValidity()) {
      hideList();
      this.value = this.getAttribute('data-wait') as string;
      submitButtonAction();
    }
  });
});
