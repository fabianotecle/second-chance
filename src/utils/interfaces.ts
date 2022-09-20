export interface Country {
  code: string;
  flag: string;
  prefix: string;
  name: string;
}

export interface CountryFromWebservice {
  idd: { root: string; suffixes: string[] };
  cca2: string;
  flags: { svg: string };
  name: { common: string };
}
