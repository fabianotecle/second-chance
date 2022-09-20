import { hideList } from '$utils/drop-down-list';

import { DROPDOWN, FORM } from './constants';

function setTabOrder() {
  const TOGGLE = document.querySelector<HTMLDivElement>(DROPDOWN.TOGGLE);
  const FIELD_INPUT = document.querySelector<HTMLInputElement>(FORM.FIELD_INPUT);
  if (TOGGLE && FIELD_INPUT) {
    TOGGLE.setAttribute('tabindex', '1');
    FIELD_INPUT.setAttribute('tabindex', '2');
  }
}

function setFailState() {
  const FORM_ELEMENT = document.getElementById(FORM.ELEMENT) as HTMLFormElement;
  FORM_ELEMENT.style.display = 'none';

  const failDiv = document.querySelector<HTMLDivElement>(FORM.FAIL_DIV);
  if (FORM_ELEMENT && failDiv) {
    failDiv.style.display = 'block';
  }
}

function setSuccessState() {
  const FORM_ELEMENT = document.getElementById(FORM.ELEMENT) as HTMLFormElement;
  FORM_ELEMENT.style.display = 'none';

  const THANKS_DIV = document.querySelector<HTMLDivElement>(FORM.THANKS_DIV);
  if (THANKS_DIV) {
    THANKS_DIV.style.display = 'block';
  }
}

async function sendForm() {
  const PHONE_NUMBER = document.querySelector<HTMLInputElement>(FORM.PHONE_NUMBER);
  const COUNTRY_CODE = document.querySelector<HTMLInputElement>(FORM.COUNTRY_CODE);
  if (PHONE_NUMBER && COUNTRY_CODE) {
    return await fetch('https://webflow.com/api/v1/form/6273d3f75ac01db3e57995c8', {
      method: 'POST',
      body:
        'fields[Phone Number]=' +
        PHONE_NUMBER.value +
        '&fields[countryCode]=' +
        COUNTRY_CODE.value +
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
  const SUBMIT_BUTTON = document.querySelector<HTMLInputElement>(FORM.SUBMIT_BUTTON);
  if (SUBMIT_BUTTON) {
    SUBMIT_BUTTON.addEventListener('click', function (event) {
      event.preventDefault();
      const FORM_ELEMENT = document.getElementById(FORM.ELEMENT) as HTMLFormElement;
      if (FORM_ELEMENT.reportValidity()) {
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
