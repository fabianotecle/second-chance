import type { Country } from '$utils/interfaces';

const countries: Country[] = [];

export async function initCountryArray() {
  await setCountryArray();
  sortCountriesArray();
  return countries;
}

async function setCountryArray() {
  const countriesFromWebservice = await getCountriesFromWebservice();
  const countriesWithoutPhoneSufix = ['US', 'PR', 'RU', 'EH', 'KZ', 'VA', 'DO', 'SH'];
  countriesFromWebservice.forEach(function (row: {
    idd: { root: string; suffixes: string[] };
    cca2: string;
    flags: { svg: string };
    name: { common: string };
  }) {
    let prefix = row.idd.root;
    const rowCountryCode = row.cca2;
    if (prefix) {
      const sufix = row.idd.suffixes[0];
      if (sufix && !countriesWithoutPhoneSufix.includes(rowCountryCode)) {
        prefix += sufix;
      }
    }
    const country = {
      code: rowCountryCode,
      flag: row.flags.svg,
      prefix: prefix,
      name: row.name.common,
    };
    countries.push(country);
  });
}

async function getCountriesFromWebservice() {
  try {
    const jsonCountriesFromWebservice = await fetch(URL_JSON_COUNTRIES_WEBSERVICE);
    return jsonCountriesFromWebservice.json();
  } catch (error) {
    const jsonCountriesFromWebservice = await fetch(URL_LOCAL_JSON_US);
    return jsonCountriesFromWebservice.json();
  }
}

const URL_JSON_COUNTRIES_WEBSERVICE =
  'https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags';

const URL_LOCAL_JSON_US = './json/us-country.json';

function sortCountriesArray() {
  let sorted = false;
  while (!sorted) {
    sorted = true;
    let index = 0;
    countries.forEach(function () {
      if (index > 0) {
        const previousIndex = index - 1;
        if (countries[previousIndex].code > countries[index].code) {
          const placeholder = countries[index];
          countries[index] = countries[previousIndex];
          countries[previousIndex] = placeholder;
          sorted = false;
        }
      }
      index = index + 1;
    });
  }
}
