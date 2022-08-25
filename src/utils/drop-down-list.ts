import type { Country } from '$utils/interfaces';
import { selectUserLocation } from '$utils/user-settings';

function clearDropDown() {
  const dropDown = document.querySelector<HTMLDivElement>('.prefix-dropdown_list');
  if (dropDown && dropDown.firstElementChild) {
    dropDown.removeChild(dropDown.firstElementChild);
  }
}

function appendAllCountries(countries: Country[]) {
  let index = 0;
  const dropDown = document.querySelector<HTMLDivElement>('.prefix-dropdown_list');
  if (dropDown) {
    countries.forEach((country) => {
      const flag = createFlagElement(country);
      const prefix = createPrefixElement(country);
      const link = createLinkElement(country, index);

      link.appendChild(flag);
      link.appendChild(prefix);
      dropDown.appendChild(link);

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
  const fieldCode = document.querySelector<HTMLInputElement>('input[name=countryCode]');
  if (fieldCode) {
    fieldCode.value = country.prefix;
  }
}

function setSelected(country: Country) {
  const display = document.querySelector<HTMLDivElement>('.prefix-dropdown_toggle');
  if (display) {
    setDisplayLink(country, display);
    setDisplayPrefix(country, display);
  }
}

function setDisplayLink(country: Country, display: HTMLDivElement) {
  const link = display.childNodes[0] as HTMLImageElement;
  link.src = country.flag;
  link.alt = country.name + ' Flag';
}

function setDisplayPrefix(country: Country, display: HTMLDivElement) {
  const prefix = display.childNodes[2] as HTMLDivElement;
  prefix.innerHTML = country.prefix;
}

function setCurrent(country: Country) {
  document.querySelectorAll<HTMLLinkElement>('.prefix-dropdown_item').forEach(function (option) {
    const link = option;
    if (link.title !== country.name) {
      link.classList.remove('w--current');
    } else {
      link.classList.add('w--current');
      arrowIndex = parseInt(link.getAttribute('data-index') as string);
    }
  });
}

function showList() {
  const dropDown = document.querySelector<HTMLDivElement>('.prefix-dropdown_list-wrapper');
  if (dropDown) {
    dropDown.style.transition = 'all 0.075s linear';
    dropDown.style.display = 'block';
  }
}

function setChevronIconUp() {
  const chevron = document.querySelector<HTMLDivElement>('.prefix-dropdown_chevron');
  if (chevron) {
    chevron.style.transition = 'all 0.075s linear';
    chevron.style.transform = 'rotate(180deg)';
  }
}

function setChevronIconDown() {
  const chevron = document.querySelector<HTMLDivElement>('.prefix-dropdown_chevron');
  if (chevron) {
    chevron.style.transition = 'all 0.075s linear';
    chevron.style.transform = 'rotate(0deg)';
  }
}

function hideWrapper() {
  const wrapper = document.querySelector<HTMLDivElement>('.prefix-dropdown_list-wrapper');
  if (wrapper) {
    wrapper.style.transition = 'all 0.075s linear';
    wrapper.style.display = 'none';
  }
}

const DIV_HEIGHT_AJUST = 2.2;

function setFocus() {
  const current = document.querySelector<HTMLDivElement>('.w--current');
  const dropDown = document.querySelector<HTMLDivElement>('.prefix-dropdown_list');
  if (current && dropDown) {
    if (current.offsetTop !== 0) {
      dropDown.scrollTop = current.offsetTop - dropDown.clientHeight / DIV_HEIGHT_AJUST;
    }
    const currentIndex = current.getAttribute('data-index') as string;
    arrowIndex = parseInt(currentIndex);
  }
}

let arrowIndex = 1;

function setSeleted(selected: HTMLLinkElement) {
  const dropDown = document.querySelector<HTMLDivElement>('.prefix-dropdown_list');
  if (dropDown) {
    dropDown.scrollTop = selected.offsetTop - dropDown.clientHeight / DIV_HEIGHT_AJUST;
    selected.classList.add('arrowSelected');
  }
}

function addListeners() {
  const dropDownElement = document.querySelector<HTMLDivElement>('.prefix-dropdown_toggle');
  if (dropDownElement) {
    dropDownElement.addEventListener('keydown', function (event: KeyboardEvent) {
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

    dropDownElement.addEventListener('click', function () {
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
  const dropDown = document.querySelector<HTMLDivElement>('.prefix-dropdown_component');
  if (dropDown && !dropDown.classList.contains('open')) {
    dropDown.classList.add('open');
    showList();
    setChevronIconUp();
  } else {
    hideList();
  }
  setFocus();
}

export function hideList() {
  const dropDown = document.querySelector<HTMLDivElement>('.prefix-dropdown_component');
  if (dropDown && dropDown.classList.contains('open')) {
    dropDown.classList.remove('open');
    hideWrapper();
    setChevronIconDown();
    deselectAll();
  }
}

export function deselectAll() {
  document.querySelectorAll<HTMLLinkElement>('.prefix-dropdown_item').forEach(function (option) {
    option.classList.remove('arrowSelected');
  });
}

export function arrowSelectCountry(event: Event, direction: string) {
  const dropDown = document.querySelector<HTMLDivElement>('.prefix-dropdown_component');
  if (dropDown && dropDown.classList.contains('open')) {
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

export function setByEnterOrSpace(event: Event) {
  if (document.activeElement === document.querySelector('.prefix-dropdown_toggle')) {
    event.preventDefault();
    const dropDown = document.querySelector<HTMLDivElement>('.prefix-dropdown_component');
    if (dropDown && dropDown.classList.contains('open')) {
      const current = document.querySelector<HTMLLinkElement>('.w--current');
      const selected = document.getElementById('div' + arrowIndex) as HTMLLinkElement;
      if (current && selected && current !== selected) {
        const country = setCountryVariable(selected);
        selectCountry(country);
      }
    }
  }
  toggleList();
}

export function focusOnTypedLetter(event: KeyboardEvent) {
  const keyTyped = event.key as string;
  const dropDown = document.querySelector<HTMLDivElement>('.prefix-dropdown_component');
  if (dropDown && dropDown.classList.contains('open') && keyTyped.match(/[a-z]/i)) {
    findLetterInList(keyTyped);
  }
}
