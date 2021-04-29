// import { IndexConfig } from '../../../dist/';

export type Colour = 'blue' | 'red' | 'green' | 'yellow' | 'brown' | 'white' | 'dark' | 'purple' | 'pink';

export interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
  salary: number;
  profession: string;
  favoriteColours: Colour[];
  country: string;
}

export const persons: Person[] = [
  {
      "id": "c59be44f-7c6d-55a6-aec1-585da9645888",
      "name": "George Marsh",
      "age": 40,
      "email": "dumoov@igiiva.bf",
      "salary": 77502,
      "profession": "Compensation Analyst",
      "favoriteColours": [
          "red"
      ],
      "country": "Belarus"
  },
  {
      "id": "eff140aa-6ea3-5ea6-ac3b-c07a8ce01f63",
      "name": "Hettie Ward",
      "age": 18,
      "email": "ci@adutujno.sa",
      "salary": 95544,
      "profession": "Office Manager",
      "favoriteColours": [
          "dark"
      ],
      "country": "Israel"
  },
  {
      "id": "03330c3f-1142-52b5-a2e7-24f4b2349556",
      "name": "Alfred Rhodes",
      "age": 30,
      "email": "tojedwo@dewpupi.pw",
      "salary": 53462,
      "profession": "Organizational Development Manager",
      "favoriteColours": [
          "red",
          "blue",
          "white"
      ],
      "country": "Norfolk Island"
  },
  {
      "id": "87e83681-7cd7-5200-b50b-493fd7bbabb5",
      "name": "Josephine Holland",
      "age": 48,
      "email": "zesedbuw@fec.al",
      "salary": 23682,
      "profession": "Corporate Planner",
      "favoriteColours": [
          "dark",
          "blue"
      ],
      "country": "Paraguay"
  },
  {
      "id": "12cf4edc-bdb0-5a8e-869f-638bf4990e07",
      "name": "Gavin Adkins",
      "age": 50,
      "email": "nul@ko.vc",
      "salary": 60744,
      "profession": "Private Banker",
      "favoriteColours": [],
      "country": "Dominican Republic"
  },
  {
      "id": "cb841649-bcf9-5acd-a85b-763da24ec749",
      "name": "Jose Matthews",
      "age": 50,
      "email": "votdumbi@napedocu.us",
      "salary": 96922,
      "profession": "Quality Control Engineer",
      "favoriteColours": [
          "purple",
          "blue",
          "brown",
          "pink"
      ],
      "country": "Tajikistan"
  },
  {
      "id": "84b1d734-52da-5009-855e-ad7e2a610b20",
      "name": "Josie Baldwin",
      "age": 56,
      "email": "apemedop@suhe.ye",
      "salary": 90167,
      "profession": "Executive Recruiter",
      "favoriteColours": [
          "yellow"
      ],
      "country": "Saudi Arabia"
  },
  {
      "id": "f569f9cd-9d4a-5753-9310-ba239f59f175",
      "name": "Pauline Walters",
      "age": 48,
      "email": "ebgoh@gaaw.cy",
      "salary": 20408,
      "profession": "Relocation Manager",
      "favoriteColours": [
          "brown",
          "red"
      ],
      "country": "Finland"
  },
  {
      "id": "7aa57520-19ad-5fcb-aa7e-0a80b388cd80",
      "name": "Howard Bishop",
      "age": 33,
      "email": "erupu@pafo.sl",
      "salary": 86221,
      "profession": "Franchise Management",
      "favoriteColours": [
          "red",
          "green"
      ],
      "country": "Barbados"
  },
  {
      "id": "68200794-220b-509b-b367-7c769f05767d",
      "name": "Katie Lambert",
      "age": 64,
      "email": "nanefse@bazuvoric.tt",
      "salary": 45390,
      "profession": "Fraud Investigator",
      "favoriteColours": [
          "blue",
          "red"
      ],
      "country": "Niger"
  },
  {
      "id": "9317f72f-9582-563b-8b48-da724c2af540",
      "name": "Emma Bridges",
      "age": 20,
      "email": "cuw@ege.hr",
      "salary": 63775,
      "profession": "Office Manager",
      "favoriteColours": [
          "purple",
          "white",
          "pink"
      ],
      "country": "Cape Verde"
  },
  {
      "id": "889f8cf9-d1a3-5276-8af5-0600bc8954e7",
      "name": "Mark Maxwell",
      "age": 22,
      "email": "tigki@du.mr",
      "salary": 79637,
      "profession": "Chiropractor",
      "favoriteColours": [
          "pink",
          "red",
          "purple",
          "yellow"
      ],
      "country": "Bulgaria"
  },
  {
      "id": "17a3b9f6-0348-54ae-9090-9861bdcaaaf1",
      "name": "Linnie McGuire",
      "age": 64,
      "email": "ag@litsu.ar",
      "salary": 64126,
      "profession": "Fund Raiser",
      "favoriteColours": [
          "brown",
          "white"
      ],
      "country": "Djibouti"
  },
  {
      "id": "16842fce-5775-5ee0-9173-0617d7216720",
      "name": "Philip Anderson",
      "age": 18,
      "email": "losuh@olaga.vc",
      "salary": 86023,
      "profession": "Recruiter",
      "favoriteColours": [
          "red"
      ],
      "country": "Taiwan"
  },
  {
      "id": "1c7cf27a-8fce-57f9-9e90-03273e63dd3a",
      "name": "Randall Fields",
      "age": 32,
      "email": "kotuligen@jopme.dk",
      "salary": 82114,
      "profession": "Production Engineer",
      "favoriteColours": [
          "white"
      ],
      "country": "French Southern Territories"
  }
];

export const storeId = 'persons';
export const indexConfig = {
  name: 'simple',
  age: 'simple',
  salary: 'simple',
  profession: 'simple',
  country: 'simple',
  favoriteColours: 'array'
};
export const keyPath = 'id';