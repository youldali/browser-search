import { useIndexValues } from 'react-browser-search';

import { storeId } from '../browserSearch';

export const useHobbiesValues = () => {
  return useIndexValues<string>(storeId, 'hobbies');
}
