import type { Country, CountryFromWebservice } from '$utils/interfaces';

const URL_JSON_COUNTRIES_WEBSERVICE =
  'https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags';

const URL_LOCAL_JSON_US = './json/us-country.json';

const CODES_WITHOUT_SUFFIX = ['US', 'PR', 'RU', 'EH', 'KZ', 'VA', 'DO', 'SH'];

let countries: Country[] = [];

async function setCountries() {
  const countriesFromWebservice = await getCountriesFromWebservice();
  countriesFromWebservice.forEach(function (row: CountryFromWebservice) {
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
  const unsortedCountries: Country[] = countries;
  countries = unsortedCountries.sort((country, country_next) => {
    if (country.code < country_next.code) {
      return -1;
    }
    if (country.code > country_next.code) {
      return 1;
    }
    return 0;
  });
}

export async function getCountries() {
  await setCountries();
  sortCountries();
  return countries;
}
