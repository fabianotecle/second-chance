import { hideList } from '$utils/drop-down-list';

function setTabOrder() {
  const divDropDownList = document.querySelector<HTMLDivElement>('.prefix-dropdown_toggle');
  const fieldInput = document.querySelector<HTMLInputElement>('.text-field.w-input');
  if (divDropDownList && fieldInput) {
    divDropDownList.setAttribute('tabindex', '1');
    fieldInput.setAttribute('tabindex', '2');
  }
}

function setFailState() {
  const formDiv = document.getElementById('phone-form') as HTMLDivElement;
  formDiv.style.display = 'none';

  const failDiv = document.querySelector<HTMLDivElement>('.w-form-fail');
  if (formDiv && failDiv) {
    failDiv.style.display = 'block';
  }
}

function setSuccessState() {
  const formDiv = document.getElementById('phone-form') as HTMLDivElement;
  formDiv.style.display = 'none';

  const thanksDiv = document.querySelector<HTMLDivElement>('.w-form-done');
  if (thanksDiv) {
    thanksDiv.style.display = 'block';
  }
}

async function sendForm() {
  const phoneNumber = document.querySelector<HTMLInputElement>('[name="phoneNumber"]');
  const countryCode = document.querySelector<HTMLInputElement>('[name="countryCode"]');
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
  const subimitButton = document.querySelector<HTMLInputElement>('.button.w-button');
  if (subimitButton) {
    subimitButton.addEventListener('click', function (event) {
      event.preventDefault();
      const formElement = document.getElementById('phone-form') as HTMLFormElement;
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
