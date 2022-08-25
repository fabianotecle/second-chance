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
    sorted = trySort();
  }
}

function trySort() {
  let sorted = true;
  const end = countries.length - 1;
  for (let index = 1; index <= end; index++) {
    if (countries[index - 1].code > countries[index].code) {
      swap(index);
      sorted = false;
    }
  }
  return sorted;
}

function swap(index: number) {
  const placeholder = countries[index];
  countries[index] = countries[index - 1];
  countries[index - 1] = placeholder;
}

export async function getCountries() {
  await setCountries();
  sortCountries();
  return countries;
}
