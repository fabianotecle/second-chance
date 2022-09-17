import { hideList } from '$utils/drop-down-list';

import { DROPDOWN, FORM } from './constants';

function setTabOrder() {
  const dropDownList = document.querySelector<HTMLDivElement>(DROPDOWN.toggle);
  const formFieldInput = FORM.fieldInput;
  if (dropDownList && formFieldInput) {
    dropDownList.setAttribute('tabindex', '1');
    formFieldInput.setAttribute('tabindex', '2');
  }
}

function setFailState() {
  const formElement = FORM.element;
  formElement.style.display = 'none';

  const formFailDiv = FORM.failDiv;
  if (formElement && formFailDiv) {
    formFailDiv.style.display = 'block';
  }
}

function setSuccessState() {
  const formElement = FORM.element;
  formElement.style.display = 'none';

  const formThanksDiv = FORM.thanksDiv;
  if (formThanksDiv) {
    formThanksDiv.style.display = 'block';
  }
}

async function sendForm() {
  const { phoneNumber } = FORM;
  const { countryCode } = FORM;
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
  const subimitButton = FORM.button;
  if (subimitButton) {
    subimitButton.addEventListener('click', function (event) {
      event.preventDefault();
      const formElement = FORM.element;
      if (formElement.reportValidity()) {
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
