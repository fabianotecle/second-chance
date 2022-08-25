import { getCountries } from '$utils/country';
import { initFront } from '$utils/front-functions';
import type { Country } from '$utils/interfaces';

import { initDropDown } from './utils/drop-down-list';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const countries: Country[] = await getCountries();

  initDropDown(countries);

  initFront();
});
