import type { Country } from '$utils/interfaces';
import { selectUserLocation } from '$utils/user-settings';

import { DROPDOWN, FORM } from './constants';

function clearDropDown() {
  const LIST = document.querySelector<HTMLDivElement>(DROPDOWN.LIST);
  if (LIST && LIST.firstElementChild) {
    LIST.removeChild(LIST.firstElementChild);
  }
}

function appendAllCountries(countries: Country[]) {
  let index = 0;
  const LIST = document.querySelector<HTMLDivElement>(DROPDOWN.LIST);
  if (LIST) {
    countries.forEach((country) => {
      const flag = createFlagElement(country);
      const prefix = createPrefixElement(country);
      const link = createLinkElement(country, index);

      link.appendChild(flag);
      link.appendChild(prefix);
      LIST.appendChild(link);

      index = index + 1;
    });
  }
}

function createFlagElement(country: Country) {
  const flag = document.createElement('img');
  flag.src = country.flag;
  flag.setAttribute('data-element', 'flag');
  flag.setAttribute('loading', 'lazy');
  flag.setAttribute('alt', country.name);
  flag.className = 'prefix-dropdown_flag';
  return flag;
}

function createPrefixElement(country: Country) {
  const prefix = document.createElement('div');
  prefix.setAttribute('data-element', 'value');
  prefix.setAttribute('data-prefix', country.prefix);
  prefix.innerHTML = country.code;
  return prefix;
}

function createLinkElement(country: Country, index: number) {
  const link = document.createElement('a');
  link.setAttribute('data-element', 'item');
  link.setAttribute('aria-role', 'option');
  link.setAttribute('aria-selected', 'false');
  link.setAttribute('aria-label', country.name);
  link.setAttribute('title', country.name);
  link.setAttribute('data-index', String(index));
  link.setAttribute('id', 'country_' + index);
  link.href = '#';
  link.className = 'prefix-dropdown_item w-inline-block';
  link.addEventListener('click', function (event) {
    setOptionByClick(event, this as unknown as HTMLLinkElement);
  });
  return link;
}

function setOptionByClick(event: MouseEvent, linkClicked: HTMLLinkElement) {
  event.preventDefault();
  const clicked = setCountryVariable(linkClicked);
  selectCountry(clicked);
  toggleList();
}

function setcountryCode(country: Country) {
  const COUNTRY_CODE = document.querySelector<HTMLInputElement>(FORM.COUNTRY_CODE);
  if (COUNTRY_CODE) {
    COUNTRY_CODE.value = country.prefix;
  }
}

function setSelected(country: Country) {
  const TOGGLE = document.querySelector<HTMLDivElement>(DROPDOWN.TOGGLE);
  if (TOGGLE) {
    setDropDownToggleLink(country, TOGGLE);
    setDropDownTogglePrefix(country, TOGGLE);
  }
}

function setDropDownToggleLink(country: Country, dropDownToggle: HTMLDivElement) {
  const link = dropDownToggle.childNodes[0] as HTMLImageElement;
  link.src = country.flag;
  link.alt = country.name + ' Flag';
}

function setDropDownTogglePrefix(country: Country, dropDownToggle: HTMLDivElement) {
  const prefix = dropDownToggle.childNodes[2] as HTMLDivElement;
  prefix.innerHTML = country.prefix;
}

function setCurrent(country: Country) {
  document.querySelectorAll<HTMLLinkElement>(DROPDOWN.ITEM).forEach(function (option) {
    const link = option;
    if (link.title !== country.name) {
      link.classList.remove('w--current');
    } else {
      link.classList.add('w--current');
      arrowIndex = parseInt(link.getAttribute('data-index') as string);
    }
  });
}

function showWrapper() {
  const WRAPPER = document.querySelector<HTMLDivElement>(DROPDOWN.WRAPPER);
  if (WRAPPER) {
    WRAPPER.style.transition = 'all 0.075s linear';
    WRAPPER.style.display = 'block';
  }
}

function setChevronIconUp() {
  const CHEVRON = document.querySelector<HTMLDivElement>(DROPDOWN.CHEVRON);
  if (CHEVRON) {
    CHEVRON.style.transition = 'all 0.075s linear';
    CHEVRON.style.transform = 'rotate(180deg)';
  }
}

function setChevronIconDown() {
  const CHEVRON = document.querySelector<HTMLDivElement>(DROPDOWN.CHEVRON);
  if (CHEVRON) {
    CHEVRON.style.transition = 'all 0.075s linear';
    CHEVRON.style.transform = 'rotate(0deg)';
  }
}

function hideWrapper() {
  const WRAPPER = document.querySelector<HTMLDivElement>(DROPDOWN.WRAPPER);
  if (WRAPPER) {
    WRAPPER.style.transition = 'all 0.075s linear';
    WRAPPER.style.display = 'none';
  }
}

const DIV_HEIGHT_AJUST = 2.2;

function setFocus() {
  const CURRENT = document.querySelector<HTMLLinkElement>(DROPDOWN.CURRENT);
  const LIST = document.querySelector<HTMLDivElement>(DROPDOWN.LIST);
  if (CURRENT && LIST) {
    if (CURRENT.offsetTop !== 0) {
      LIST.scrollTop = CURRENT.offsetTop - LIST.clientHeight / DIV_HEIGHT_AJUST;
    }
    const currentIndex = CURRENT.getAttribute('data-index') as string;
    arrowIndex = parseInt(currentIndex);
  }
}

let arrowIndex = 1;

function setSeleted(selected: HTMLLinkElement) {
  const LIST = document.querySelector<HTMLDivElement>(DROPDOWN.LIST);
  if (LIST) {
    LIST.scrollTop = selected.offsetTop - LIST.clientHeight / DIV_HEIGHT_AJUST;
    selected.classList.add('arrowSelected');
  }
}

function addListeners() {
  const TOGGLE = document.querySelector<HTMLDivElement>(DROPDOWN.TOGGLE);
  if (TOGGLE) {
    TOGGLE.addEventListener('keydown', function (event: KeyboardEvent) {
      switch (event.key) {
        case 'ArrowDown':
          selectCountryByUpOrDown(event, 'down');
          break;
        case 'ArrowUp':
          selectCountryByUpOrDown(event, 'up');
          break;
        case 'Enter':
          selectCountryByEnterOrSpace(event);
          break;
        case ' ':
          selectCountryByEnterOrSpace(event);
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

    TOGGLE.addEventListener('click', function () {
      toggleList();
    });
  }
}

function findLetterInList(keyTyped: string) {
  const letterTyped = keyTyped.toUpperCase();
  let index = 0;
  let found = 0;
  let link = document.getElementById('country_' + index) as HTMLLinkElement;
  while (link && !found) {
    const compare = link.childNodes[1] as HTMLDivElement;
    if (letterTyped === compare.innerHTML.charAt(0)) {
      deselectAll();
      arrowIndex = index;
      setSeleted(link);
      found = 1;
    }
    index = index + 1;
    link = document.getElementById('country_' + index) as HTMLLinkElement;
  }
}

export function initDropDown(countries: Country[]) {
  clearDropDown();
  appendAllCountries(countries);
  selectUserLocation();
  addListeners();
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
  setcountryCode(country);
  setSelected(country);
  setCurrent(country);
}

export function toggleList() {
  const COMPONENT = document.querySelector<HTMLDivElement>(DROPDOWN.COMPONENT);
  if (COMPONENT && !COMPONENT.classList.contains('open')) {
    COMPONENT.classList.add('open');
    showWrapper();
    setChevronIconUp();
  } else {
    hideList();
  }
  setFocus();
}

export function hideList() {
  const COMPONENT = document.querySelector<HTMLDivElement>(DROPDOWN.COMPONENT);
  if (COMPONENT && COMPONENT.classList.contains('open')) {
    COMPONENT.classList.remove('open');
    hideWrapper();
    setChevronIconDown();
    deselectAll();
  }
}

export function deselectAll() {
  document.querySelectorAll<HTMLLinkElement>(DROPDOWN.ITEM).forEach(function (option) {
    option.classList.remove('arrowSelected');
  });
}

export function selectCountryByUpOrDown(event: Event, direction: string) {
  const COMPONENT = document.querySelector<HTMLDivElement>(DROPDOWN.COMPONENT);
  if (COMPONENT && COMPONENT.classList.contains('open')) {
    event.preventDefault();
    if (direction === 'up') {
      const selected = document.getElementById('country_' + (arrowIndex - 1)) as HTMLLinkElement;
      if (selected) {
        arrowIndex = arrowIndex - 1;
        deselectAll();
        setSeleted(selected);
      }
    } else {
      const selected = document.getElementById('country_' + (arrowIndex + 1)) as HTMLLinkElement;
      if (selected) {
        arrowIndex = arrowIndex + 1;
        deselectAll();
        setSeleted(selected);
      }
    }
  }
}

export function selectCountryByEnterOrSpace(event: Event) {
  if (document.activeElement === document.querySelector<HTMLDivElement>(DROPDOWN.TOGGLE)) {
    event.preventDefault();
    const COMPONENT = document.querySelector<HTMLDivElement>(DROPDOWN.COMPONENT);
    if (COMPONENT && COMPONENT.classList.contains('open')) {
      const dropDownCurrent = document.querySelector<HTMLLinkElement>(DROPDOWN.CURRENT);
      const selected = document.getElementById('country_' + arrowIndex) as HTMLLinkElement;
      if (dropDownCurrent && selected && dropDownCurrent !== selected) {
        const country = setCountryVariable(selected);
        selectCountry(country);
      }
    }
  }
  toggleList();
}

export function focusOnTypedLetter(event: KeyboardEvent) {
  const keyTyped = event.key as string;
  const COMPONENT = document.querySelector<HTMLDivElement>(DROPDOWN.COMPONENT);
  if (COMPONENT && COMPONENT.classList.contains('open') && keyTyped.match(/[a-z]/i)) {
    findLetterInList(keyTyped);
  }
}
