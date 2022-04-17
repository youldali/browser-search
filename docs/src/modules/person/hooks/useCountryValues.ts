import { useIndexValues } from 'react-browser-search';

import { storeId } from '../browserSearch';

export const countryFilterConfigKey = 'country';
export const countryFilterAppliedGroupKey = 'country';
export const countryGetFilterId = (country: string): string => `country-${country}`;

export const useCountryValues = () => {
  return useIndexValues<string>(storeId, 'country')
}
