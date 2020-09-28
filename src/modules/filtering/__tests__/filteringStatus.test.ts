import { getFilterStatusForItem } from '../filteringStatus';
import * as fixtures from 'modules/__fixtures__/fixtures';

describe('getFilterStatusForItem', () => {
	fixtures.items.forEach( item => {
		test(`correct filterStatus for item: ${JSON.stringify(item)}`, () => {
			expect(getFilterStatusForItem(fixtures.filteringData)(item)).toMatchSnapshot();
		});
	})
});
