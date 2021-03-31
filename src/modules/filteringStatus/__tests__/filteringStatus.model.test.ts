import { getFilterStatusFromFilterConfig } from '../index';
import * as fixtures from 'modules/__fixtures__/fixtures';

describe('getFilterStatusForItem', () => {
	const getFilterStatusForItem = getFilterStatusFromFilterConfig(fixtures.filterConfigData);

	fixtures.items.forEach( item => {
		test(`correct filterStatus for item: ${JSON.stringify(item)}`, () => {
			expect(getFilterStatusForItem(item)).toMatchSnapshot();
		});
	})
});
