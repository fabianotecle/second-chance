import { hideList } from '$utils/drop-down-list';

import { DROPDOWN, FORM } from './constants';

function setTabOrder() {
  const toggle = document.querySelector<HTMLDivElement>(DROPDOWN.TOGGLE);
  const input = document.querySelector<HTMLInputElement>(FORM.FIELD_INPUT);
  if (toggle && input) {
    toggle.setAttribute('tabindex', '1');
    input.setAttribute('tabindex', '2');
  }
}

function setFailState() {
  const element = FORM.ELEMENT;
  element.style.display = 'none';

  const failDiv = FORM.FAIL_DIV;
  if (element && failDiv) {
    failDiv.style.display = 'block';
  }
}

function setSuccessState() {
  const element = FORM.ELEMENT;
  element.style.display = 'none';

  const formThanksDiv = FORM.THANKS_DIV;
  if (formThanksDiv) {
    formThanksDiv.style.display = 'block';
  }
}

async function sendForm() {
  const phoneNumber = document.querySelector<HTMLInputElement>(FORM.PHONE_NUMBER);
  const countryCode = document.querySelector<HTMLInputElement>(FORM.COUNTRY_CODE);
  if (phoneNumber && countryCode) {
    return await fetch('https://webflow.com/api/v1/form/6273d3f75ac01db3e57995c8', {
      method: 'POST',
      body:
        'fields[Phone Number]=' +
        phoneNumber.value +
        '&fields[countryCode]=' +
        countryCode.value +
        '&name=Phone Form&dolphin=false&teste=false&source=https://secondchancefinsweet.webflow.io/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    });
  }
}

async function submitButtonAction() {
  hideList();

  const response = await sendForm();

  if (response && !response.ok) {
    setFailState();
  } else {
    setSuccessState();
  }
}

function addButtonListener() {
  const subimitButton = document.querySelector<HTMLInputElement>(FORM.BUTTON);
  if (subimitButton) {
    subimitButton.addEventListener('click', function (event) {
      event.preventDefault();
      const element = FORM.ELEMENT;
      if (element.reportValidity()) {
        this.value = this.getAttribute('data-wait') as string;
        submitButtonAction();
      }
    });
  }
}

export function initFront() {
  setTabOrder();
  addButtonListener();
}
