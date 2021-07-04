import { Person } from '../../modules'
import { HeadCell, useItemTable } from '../ItemTable'


export const usePersonTable = () => {
  const itemTableProps = useItemTable({
    headCells,
  });

  return itemTableProps;
}

const headCells: HeadCell<Person>[] = [
  { id: 'name', numeric: false, label: 'Name' },
  { id: 'age', numeric: true, label: 'Age' },
  { id: 'country', numeric: false, label: 'Country' },
  { id: 'email', numeric: false, label: 'Email' },
  { id: 'profession', numeric: false, label: 'Profession' },
  { id: 'salary', numeric: true, label: 'Salary' },
  { id: 'favoriteColours', numeric: false, label: 'Favorite colours' },
];

