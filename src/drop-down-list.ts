import type { Country } from '$utils/interfaces';

export function initDropDownList(countries: Country[]) {
  clearDivCountryList();
  appendAllCountryOptionsToDivCountryList(countries);
}

function clearDivCountryList() {
  const divCountryList = document.querySelector('.prefix-dropdown_list') as HTMLDivElement;
  if (divCountryList.firstElementChild) {
    divCountryList.removeChild(divCountryList.firstElementChild);
  }
}

function appendAllCountryOptionsToDivCountryList(countries: Country[]) {
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

function setOptionByClick(event: MouseEvent, linkClicked: HTMLLinkElement) {
  event.preventDefault();
  const countrySelected = setCountryVariable(linkClicked);
  selectCountry(countrySelected);
  toggleList();
}

export function setCountryVariable(divLink: HTMLLinkElement) {
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

export function selectCountry(country: Country) {
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

export function toggleList() {
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

export function hideList() {
  const dropDownSelectedInformation = document.querySelector(
    '.prefix-dropdown_component'
  ) as HTMLDivElement;
  if (dropDownSelectedInformation.classList.contains('open')) {
    dropDownSelectedInformation.classList.remove('open');
    const dropDownList = document.querySelector('.prefix-dropdown_list-wrapper') as HTMLDivElement;
    dropDownList.style.transition = 'all 0.075s linear';
    dropDownList.style.display = 'none';
    setChevronIconDown();
    deselectAll();
  }
}

function setChevronIconDown() {
  const openCloseArrow = document.querySelector('.prefix-dropdown_chevron') as HTMLDivElement;
  openCloseArrow.style.transition = 'all 0.075s linear';
  openCloseArrow.style.transform = 'rotate(0deg)';
}

export function deselectAll() {
  document.querySelectorAll('.prefix-dropdown_item').forEach(function (option) {
    option.classList.remove('arrowSelected');
  });
}

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

let arrowIndex = 1;

export function arrowSelectCountry(event: Event, direction: string) {
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
  countryList.scrollTop = country_selected.offsetTop - countryList.clientHeight / DIV_HEIGHT_AJUST;
  country_selected.classList.add('arrowSelected');
}

export function setByEnterOrSpace(event: Event) {
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

export function focusOnTypedLetter(event: KeyboardEvent) {
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
