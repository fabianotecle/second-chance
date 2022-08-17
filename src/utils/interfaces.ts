export interface Country {
  code: string;
  flag: string;
  prefix: string;
  name: string;
}

export interface CountryRow {
  idd: { root: string; suffixes: string[] };
  cca2: string;
  flags: { svg: string };
  name: { common: string };
}
