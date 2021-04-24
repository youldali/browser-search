import { getFilterStatusFromFilterConfig } from '../index';
import { filterConfigDataFixture, itemsFixture } from './__fixtures__/fixtures';

describe('getFilterStatusForItem', () => {
	const getFilterStatusForItem = getFilterStatusFromFilterConfig(filterConfigDataFixture);

	itemsFixture.forEach( item => {
		test(`correct filterStatus for item: ${JSON.stringify(item)}`, () => {
			expect(getFilterStatusForItem(item)).toMatchSnapshot();
		});
	})
});
