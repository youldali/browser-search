import { useIndexValues } from 'react-browser-search';

import { storeId } from '../browserSearch';

export const useCountryValues = () => {
  return useIndexValues<string>(storeId, 'country')
}
