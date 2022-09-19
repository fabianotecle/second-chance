import type { Country } from '$utils/interfaces';
import { selectUserLocation } from '$utils/user-settings';

import { DROPDOWN, FORM } from './constants';

function clearDropDown() {
  const list = document.querySelector<HTMLDivElement>(DROPDOWN.LIST);
  if (list && list.firstElementChild) {
    list.removeChild(list.firstElementChild);
  }
}

function appendAllCountries(countries: Country[]) {
  let index = 0;
  const list = document.querySelector<HTMLDivElement>(DROPDOWN.LIST);
  if (list) {
    countries.forEach((country) => {
      const flag = createFlagElement(country);
      const prefix = createPrefixElement(country);
      const link = createLinkElement(country, index);

      link.appendChild(flag);
      link.appendChild(prefix);
      list.appendChild(link);

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
  link.setAttribute('id', 'div' + index);
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
  const countryCode = document.querySelector<HTMLInputElement>(FORM.COUNTRY_CODE);
  if (countryCode) {
    countryCode.value = country.prefix;
  }
}

function setSelected(country: Country) {
  const toggle = document.querySelector<HTMLDivElement>(DROPDOWN.TOGGLE);
  if (toggle) {
    setDropDownToggleLink(country, toggle);
    setDropDownTogglePrefix(country, toggle);
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
  const wrapper = document.querySelector<HTMLDivElement>(DROPDOWN.WRAPPER);
  if (wrapper) {
    wrapper.style.transition = 'all 0.075s linear';
    wrapper.style.display = 'block';
  }
}

function setChevronIconUp() {
  const chevron = document.querySelector<HTMLDivElement>(DROPDOWN.CHEVRON);
  if (chevron) {
    chevron.style.transition = 'all 0.075s linear';
    chevron.style.transform = 'rotate(180deg)';
  }
}

function setChevronIconDown() {
  const chevron = document.querySelector<HTMLDivElement>(DROPDOWN.CHEVRON);
  if (chevron) {
    chevron.style.transition = 'all 0.075s linear';
    chevron.style.transform = 'rotate(0deg)';
  }
}

function hideWrapper() {
  const wrapper = document.querySelector<HTMLDivElement>(DROPDOWN.WRAPPER);
  if (wrapper) {
    wrapper.style.transition = 'all 0.075s linear';
    wrapper.style.display = 'none';
  }
}

const DIV_HEIGHT_AJUST = 2.2;

function setFocus() {
  const current = document.querySelector<HTMLLinkElement>(DROPDOWN.CURRENT);
  const list = document.querySelector<HTMLDivElement>(DROPDOWN.LIST);
  if (current && list) {
    if (current.offsetTop !== 0) {
      list.scrollTop = current.offsetTop - list.clientHeight / DIV_HEIGHT_AJUST;
    }
    const currentIndex = current.getAttribute('data-index') as string;
    arrowIndex = parseInt(currentIndex);
  }
}

let arrowIndex = 1;

function setSeleted(selected: HTMLLinkElement) {
  const list = document.querySelector<HTMLDivElement>(DROPDOWN.LIST);
  if (list) {
    list.scrollTop = selected.offsetTop - list.clientHeight / DIV_HEIGHT_AJUST;
    selected.classList.add('arrowSelected');
  }
}

function addListeners() {
  const toggle = document.querySelector<HTMLDivElement>(DROPDOWN.TOGGLE);
  if (toggle) {
    toggle.addEventListener('keydown', function (event: KeyboardEvent) {
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

    toggle.addEventListener('click', function () {
      toggleList();
    });
  }
}

function findLetterInList(keyTyped: string) {
  const letterTyped = keyTyped.toUpperCase();
  let index = 0;
  let found = 0;
  let link = document.getElementById('div' + index) as HTMLLinkElement;
  while (link && !found) {
    const compare = link.childNodes[1] as HTMLDivElement;
    if (letterTyped === compare.innerHTML.charAt(0)) {
      deselectAll();
      arrowIndex = index;
      setSeleted(link);
      found = 1;
    }
    index = index + 1;
    link = document.getElementById('div' + index) as HTMLLinkElement;
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
  const component = document.querySelector<HTMLDivElement>(DROPDOWN.COMPONENT);
  if (component && !component.classList.contains('open')) {
    component.classList.add('open');
    showWrapper();
    setChevronIconUp();
  } else {
    hideList();
  }
  setFocus();
}

export function hideList() {
  const component = document.querySelector<HTMLDivElement>(DROPDOWN.COMPONENT);
  if (component && component.classList.contains('open')) {
    component.classList.remove('open');
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
  const component = document.querySelector<HTMLDivElement>(DROPDOWN.COMPONENT);
  if (component && component.classList.contains('open')) {
    event.preventDefault();
    if (direction === 'up') {
      const selected = document.getElementById('div' + (arrowIndex - 1)) as HTMLLinkElement;
      if (selected) {
        arrowIndex = arrowIndex - 1;
        deselectAll();
        setSeleted(selected);
      }
    } else {
      const selected = document.getElementById('div' + (arrowIndex + 1)) as HTMLLinkElement;
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
    const component = document.querySelector<HTMLDivElement>(DROPDOWN.COMPONENT);
    if (component && component.classList.contains('open')) {
      const dropDownCurrent = document.querySelector<HTMLLinkElement>(DROPDOWN.CURRENT);
      const selected = document.getElementById('div' + arrowIndex) as HTMLLinkElement;
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
  const component = document.querySelector<HTMLDivElement>(DROPDOWN.COMPONENT);
  if (component && component.classList.contains('open') && keyTyped.match(/[a-z]/i)) {
    findLetterInList(keyTyped);
  }
}
