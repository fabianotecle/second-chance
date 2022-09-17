import type { Country } from '$utils/interfaces';
import { selectUserLocation } from '$utils/user-settings';

import { DROPDOWN, FORM } from './constants';

function clearDropDown() {
  const dropDownList = document.querySelector<HTMLDivElement>(DROPDOWN.list);
  if (dropDownList && dropDownList.firstElementChild) {
    dropDownList.removeChild(dropDownList.firstElementChild);
  }
}

function appendAllCountries(countries: Country[]) {
  let index = 0;
  const dropDownList = document.querySelector<HTMLDivElement>(DROPDOWN.list);
  if (dropDownList) {
    countries.forEach((country) => {
      const flag = createFlagElement(country);
      const prefix = createPrefixElement(country);
      const link = createLinkElement(country, index);

      link.appendChild(flag);
      link.appendChild(prefix);
      dropDownList.appendChild(link);

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

function setFieldCode(country: Country) {
  const fieldCode = FORM.countryCode;
  if (fieldCode) {
    fieldCode.value = country.prefix;
  }
}

function setSelected(country: Country) {
  const dropDownToggle = document.querySelector<HTMLDivElement>(DROPDOWN.toggle);
  if (dropDownToggle) {
    setDropDownToggleLink(country, dropDownToggle);
    setDropDownTogglePrefix(country, dropDownToggle);
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
  document.querySelectorAll<HTMLLinkElement>(DROPDOWN.item).forEach(function (option) {
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
  const dropDownWrapper = document.querySelector<HTMLDivElement>(DROPDOWN.wrapper);
  if (dropDownWrapper) {
    dropDownWrapper.style.transition = 'all 0.075s linear';
    dropDownWrapper.style.display = 'block';
  }
}

function setChevronIconUp() {
  const dropDownChevron = document.querySelector<HTMLDivElement>(DROPDOWN.chevron);
  if (dropDownChevron) {
    dropDownChevron.style.transition = 'all 0.075s linear';
    dropDownChevron.style.transform = 'rotate(180deg)';
  }
}

function setChevronIconDown() {
  const dropDownChevron = document.querySelector<HTMLDivElement>(DROPDOWN.chevron);
  if (dropDownChevron) {
    dropDownChevron.style.transition = 'all 0.075s linear';
    dropDownChevron.style.transform = 'rotate(0deg)';
  }
}

function hideWrapper() {
  const dropDownWrapper = document.querySelector<HTMLDivElement>(DROPDOWN.wrapper);
  if (dropDownWrapper) {
    dropDownWrapper.style.transition = 'all 0.075s linear';
    dropDownWrapper.style.display = 'none';
  }
}

const DIV_HEIGHT_AJUST = 2.2;

function setFocus() {
  const dropDownCurrent = document.querySelector<HTMLLinkElement>(DROPDOWN.current);
  const dropDownList = document.querySelector<HTMLDivElement>(DROPDOWN.list);
  if (dropDownCurrent && dropDownList) {
    if (dropDownCurrent.offsetTop !== 0) {
      dropDownList.scrollTop =
        dropDownCurrent.offsetTop - dropDownList.clientHeight / DIV_HEIGHT_AJUST;
    }
    const currentIndex = dropDownCurrent.getAttribute('data-index') as string;
    arrowIndex = parseInt(currentIndex);
  }
}

let arrowIndex = 1;

function setSeleted(selected: HTMLLinkElement) {
  const dropDownList = document.querySelector<HTMLDivElement>(DROPDOWN.list);
  if (dropDownList) {
    dropDownList.scrollTop = selected.offsetTop - dropDownList.clientHeight / DIV_HEIGHT_AJUST;
    selected.classList.add('arrowSelected');
  }
}

function addListeners() {
  const dropDownToggle = document.querySelector<HTMLDivElement>(DROPDOWN.toggle);
  if (dropDownToggle) {
    dropDownToggle.addEventListener('keydown', function (event: KeyboardEvent) {
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

    dropDownToggle.addEventListener('click', function () {
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
  setFieldCode(country);
  setSelected(country);
  setCurrent(country);
}

export function toggleList() {
  const dropDownComponent = document.querySelector<HTMLDivElement>(DROPDOWN.component);
  if (dropDownComponent && !dropDownComponent.classList.contains('open')) {
    dropDownComponent.classList.add('open');
    showWrapper();
    setChevronIconUp();
  } else {
    hideList();
  }
  setFocus();
}

export function hideList() {
  const dropDownComponent = document.querySelector<HTMLDivElement>(DROPDOWN.component);
  if (dropDownComponent && dropDownComponent.classList.contains('open')) {
    dropDownComponent.classList.remove('open');
    hideWrapper();
    setChevronIconDown();
    deselectAll();
  }
}

export function deselectAll() {
  document.querySelectorAll<HTMLLinkElement>(DROPDOWN.item).forEach(function (option) {
    option.classList.remove('arrowSelected');
  });
}

export function selectCountryByUpOrDown(event: Event, direction: string) {
  const dropDowncomponent = document.querySelector<HTMLDivElement>(DROPDOWN.component);
  if (dropDowncomponent && dropDowncomponent.classList.contains('open')) {
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
  if (document.activeElement === document.querySelector<HTMLDivElement>(DROPDOWN.toggle)) {
    event.preventDefault();
    const dropDownComponent = document.querySelector<HTMLDivElement>(DROPDOWN.component);
    if (dropDownComponent && dropDownComponent.classList.contains('open')) {
      const dropDownCurrent = document.querySelector<HTMLLinkElement>(DROPDOWN.current);
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
  const dropDownComponent = document.querySelector<HTMLDivElement>(DROPDOWN.component);
  if (
    dropDownComponent &&
    dropDownComponent.classList.contains('open') &&
    keyTyped.match(/[a-z]/i)
  ) {
    findLetterInList(keyTyped);
  }
}
