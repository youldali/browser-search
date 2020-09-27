import { getFilterStatusForItem } from '../filteringStatus';
import { items } from 'modules/__fixtures__/filteringStatus.fixture';
import { filteringData as filteringDataFixture} from 'modules/__fixtures__/filtering.fixture';

describe('getFilterStatusForItem', () => {
	items.forEach( item => {
		test(`correct filterStatus for item: ${JSON.stringify(item)}`, () => {
			expect(getFilterStatusForItem(filteringDataFixture)(item)).toMatchSnapshot();
		});
	})
});
