import { useIndexValues } from 'react-browser-search';

import { storeId } from '../browserSearch';

export const hobbyFilterConfigKey = 'hobby';
export const hobbyFilterAppliedGroupKey = 'hobby';
export const hobbyGetFilterId = (hobby: string): string => `hobby-${hobby}`;

export const allOfHobbiesGetFilterConfigKey = (hobby: string): string => `hobbiesAllOf-${hobby}`;
export const allOfHobbiesGetFilterId = (hobby: string): string => `hobbiesAllOf-${hobby}`;
export const allOfHobbiesFilterAppliedGroupKey = 'hobbiesAllOf';

export const useHobbiesValues = () => {
  return useIndexValues<string>(storeId, 'hobbies');
}
