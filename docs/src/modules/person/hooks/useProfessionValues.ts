import { useIndexValues } from 'react-browser-search';

import { storeId } from '../browserSearch';

export const useProfessionValues = () => {
  return useIndexValues<string>(storeId, 'profession');
}
