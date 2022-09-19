export const DROPDOWN = {
  LIST: '.prefix-dropdown_list',
  TOGGLE: '.prefix-dropdown_toggle',
  WRAPPER: '.prefix-dropdown_list-wrapper',
  CHEVRON: '.prefix-dropdown_chevron',
  CURRENT: '.w--current',
  COMPONENT: '.prefix-dropdown_component',
  ITEM: '.prefix-dropdown_item',
};

export const FORM = {
  FIELD_INPUT: '.text-field.w-input',
  ELEMENT: document.getElementById('phone-form') as HTMLFormElement,
  FAIL_DIV: document.querySelector<HTMLDivElement>('.w-form-fail'),
  THANKS_DIV: document.querySelector<HTMLDivElement>('.w-form-done'),
  PHONE_NUMBER: '[name="phoneNumber"]',
  COUNTRY_CODE: '[name="countryCode"]',
  BUTTON: '.button.w-button',
};
