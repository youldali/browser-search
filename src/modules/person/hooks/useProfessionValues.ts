import { useIndexValues } from '@browser-search/react-browser-search';

import { storeId } from '../browserSearch';

export const professionFilterConfigKey = 'profession';
export const professionFilterAppliedGroupKey = 'profession';
export const professionGetFilterId = (profession: string): string => `profession-${profession}`;

export const useProfessionValues = () => {
  return useIndexValues<string>(storeId, 'profession');
}
