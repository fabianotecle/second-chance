import { hideList } from '$utils/drop-down-list';

function setTabOrder() {
  const divDropDownList = document.querySelector('.prefix-dropdown_toggle') as HTMLDivElement;
  divDropDownList.setAttribute('tabindex', '1');

  const fieldInput = document.querySelector('.text-field.w-input') as HTMLInputElement;
  fieldInput.setAttribute('tabindex', '2');
}

function setFailState() {
  const formDiv = document.getElementById('phone-form') as HTMLDivElement;
  formDiv.style.display = 'none';

  const failDiv = document.querySelector('.w-form-fail') as HTMLDivElement;
  failDiv.style.display = 'block';
}

function setSuccessState() {
  const formDiv = document.getElementById('phone-form') as HTMLDivElement;
  formDiv.style.display = 'none';

  const thanksDiv = document.querySelector('.w-form-done') as HTMLDivElement;
  thanksDiv.style.display = 'block';
}

async function sendForm() {
  const phoneNumber = document.querySelector('[name="phoneNumber"]') as HTMLInputElement;
  const countryCode = document.querySelector('[name="countryCode"]') as HTMLInputElement;

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

async function submitButtonAction() {
  hideList();

  const response = await sendForm();

  if (!response.ok) {
    setFailState();
  } else {
    setSuccessState();
  }
}

function addButtonListener() {
  const subimitButton = document.querySelector('.button.w-button') as HTMLInputElement;
  subimitButton.addEventListener('click', function (event) {
    event.preventDefault();
    const formElement = document.getElementById('phone-form') as HTMLFormElement;
    if (formElement.reportValidity()) {
      this.value = this.getAttribute('data-wait') as string;
      submitButtonAction();
    }
  });
}

export function initFront() {
  setTabOrder();
  addButtonListener();
}
