import { initCountryArray } from '$utils/country';
import { greetUser } from '$utils/greet';
import type { Country } from '$utils/interfaces';
import { selectUserCountry } from '$utils/user-settings';

import {
  initDropDownList,
  toggleList,
  hideList,
  arrowSelectCountry,
  setByEnterOrSpace,
  focusOnTypedLetter,
} from './drop-down-list';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const name = 'Fabiano Alves';
  greetUser(name);

  let countries: Country[] = [];
  countries = await initCountryArray();

  initDropDownList(countries);

  selectUserCountry();

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
