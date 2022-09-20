import { deselectAll, selectCountry, setCountryVariable } from '$utils/drop-down-list';

const userCoutryCode = getUserLocation();

function getUserLocation() {
  const userBrowserInformation = navigator.language.split('-');
  const USER_LOCATION_CODE_INDEX = 1;
  return userBrowserInformation[USER_LOCATION_CODE_INDEX];
}

export function selectUserLocation() {
  let index = 0;
  let found = false;
  let linkCountryOption = document.getElementById('country_' + index) as HTMLLinkElement;
  while (linkCountryOption && !found) {
    const divToCompare = linkCountryOption.childNodes[1] as HTMLDivElement;
    if (userCoutryCode === divToCompare.innerHTML) {
      deselectAll();
      const countryFound = setCountryVariable(linkCountryOption);
      selectCountry(countryFound);
      found = true;
    }
    index = index + 1;
    linkCountryOption = document.getElementById('country_' + index) as HTMLLinkElement;
  }
}
