export const DROPDOWN = {
  list: '.prefix-dropdown_list',
  toggle: '.prefix-dropdown_toggle',
  wrapper: '.prefix-dropdown_list-wrapper',
  chevron: '.prefix-dropdown_chevron',
  current: '.w--current',
  component: '.prefix-dropdown_component',
  item: '.prefix-dropdown_item',
};

export const FORM = {
  fieldInput: document.querySelector<HTMLInputElement>('.text-field.w-input'),
  element: document.getElementById('phone-form') as HTMLFormElement,
  failDiv: document.querySelector<HTMLDivElement>('.w-form-fail'),
  thanksDiv: document.querySelector<HTMLDivElement>('.w-form-done'),
  phoneNumber: document.querySelector<HTMLInputElement>('[name="phoneNumber"]'),
  countryCode: document.querySelector<HTMLInputElement>('[name="countryCode"]'),
  button: document.querySelector<HTMLInputElement>('.button.w-button'),
};
