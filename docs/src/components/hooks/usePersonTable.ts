import { personGenerator } from '../../modules'
import { HeadCell, OrderDirection, useItemTable } from '../ItemTable'

type Person = personGenerator.Person;

type UsePersonTableProps = {
  perPage?: number;
  page?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
}

export const usePersontable = (personTableProps: UsePersonTableProps) => {
  const itemTableProps = useItemTable({
    data: personsData,
    headCells,
    ...personTableProps
  });

  return itemTableProps;
}

const headCells: HeadCell<Person>[] = [
  { id: 'name', numeric: false, label: 'Name' },
  { id: 'age', numeric: true, label: 'Age' },
  { id: 'country', numeric: false, label: 'Country' },
  { id: 'email', numeric: false, label: 'Email' },
  { id: 'profession', numeric: true, label: 'Profession' },
  { id: 'salary', numeric: true, label: 'Salary' },
  { id: 'favoriteColours', numeric: true, label: 'Favorite colours' },
];

const personsData: Person[] = 
[
  {
      id: '1',
      "name": "Willie Garza",
      "age": 38,
      "email": "id@ipasag.cv",
      "salary": 61299,
      "profession": "Interior Decorator",
      "favoriteColours": [
          "yellow",
          "white",
          "blue",
          "pink"
      ],
      "country": "Taiwan"
  },
  {
    id: '2',
      "name": "Gene Fletcher",
      "age": 37,
      "email": "fowa@uhuma.tv",
      "salary": 61075,
      "profession": "University Administrator",
      "favoriteColours": [
          "pink",
          "yellow",
          "brown",
          "purple"
      ],
      "country": "Kiribati"
  },
  {
    id: '3',
      "name": "Sallie Garrett",
      "age": 41,
      "email": "fufcuva@wepzizawa.sv",
      "salary": 67792,
      "profession": "Design Engineer",
      "favoriteColours": [
          "pink",
          "white",
          "dark",
          "brown"
      ],
      "country": "Turks & Caicos Islands"
  },
  {
    id: '4',
      "name": "Rosa Byrd",
      "age": 50,
      "email": "ebkoz@ih.hn",
      "salary": 44593,
      "profession": "Warehouse Manager",
      "favoriteColours": [
          "purple",
          "blue",
          "red",
          "dark"
      ],
      "country": "Sri Lanka"
  },
  {
    id: '5',
      "name": "Mollie Kelley",
      "age": 55,
      "email": "vedal@sep.bb",
      "salary": 37696,
      "profession": "Quality Control Inspector",
      "favoriteColours": [],
      "country": "Marshall Islands"
  },
]