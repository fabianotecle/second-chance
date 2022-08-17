import type { Country, CountryRow } from '$utils/interfaces';

const URL_JSON_COUNTRIES_WEBSERVICE =
  'https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags';

const URL_LOCAL_JSON_US = './json/us-country.json';

const CODES_WITHOUT_SUFFIX = ['US', 'PR', 'RU', 'EH', 'KZ', 'VA', 'DO', 'SH'];

const countries: Country[] = [];

async function setCountries() {
  const countriesFromWebservice = await getCountriesFromWebservice();
  countriesFromWebservice.forEach(function (row: CountryRow) {
    let prefix = row.idd.root;
    const code = row.cca2;
    if (prefix) {
      const sufix = row.idd.suffixes[0];
      if (sufix && !CODES_WITHOUT_SUFFIX.includes(code)) {
        prefix += sufix;
      }
    }
    const country = {
      code: code,
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

function sortCountries() {
  let sorted = false;
  while (!sorted) {
    sorted = sort();
  }
}

function sort() {
  let sorted = true;
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
  return sorted;
}

export async function getCountries() {
  await setCountries();
  sortCountries();
  return countries;
}
