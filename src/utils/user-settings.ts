import { deselectAll, selectCountry, setCountryVariable } from 'src/drop-down-list';

const userCoutryCode = getUserCountry();

function getUserCountry() {
  const userBrowserInformation = navigator.language.split('-');
  const USER_COUNTRY_CODE_INDEX = 1;
  return userBrowserInformation[USER_COUNTRY_CODE_INDEX];
}

export function selectUserCountry() {
  let index = 0;
  let found = false;
  let linkCountryOption = document.getElementById('div' + index) as HTMLLinkElement;
  while (linkCountryOption && !found) {
    const divToCompare = linkCountryOption.childNodes[1] as HTMLDivElement;
    if (userCoutryCode === divToCompare.innerHTML) {
      deselectAll();
      const countryFound = setCountryVariable(linkCountryOption);
      selectCountry(countryFound);
      found = true;
    }
    index = index + 1;
    linkCountryOption = document.getElementById('div' + index) as HTMLLinkElement;
  }
}
