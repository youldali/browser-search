import getFilterStatusForItem from '../filteringStatus';
import * as fixtures from 'modules/__fixtures__/filteringStatus.fixture';
import { filteringData as filteringDataFixture} from 'modules/__fixtures__/filtering.fixture';

describe('getFilterStatusForItem', () => {
	test('Should return the correct filterStatus for each item filtered', () => {
		fixtures.dataToFilterStatus.forEach( (filterStatus, data,) => {
			expect(getFilterStatusForItem(filteringDataFixture)(data)).toEqual(filterStatus)
		})
	});
});
