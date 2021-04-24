import { getFilterStatusForItem } from '../filteringStatus.model';
import { 
  getFilteringFunctionsData, 
} from '../filteringFunctions.model';
import { filterConfigDataFixture, itemsFixture } from './__fixtures__/fixtures';

describe('getFilterStatusForItem', () => {
  const filteringFunctionsData = getFilteringFunctionsData(filterConfigDataFixture);
	const getFilterStatusForItems = getFilterStatusForItem(filteringFunctionsData);

	itemsFixture.forEach( item => {
		test(`correct filterStatus for item: ${JSON.stringify(item)}`, () => {
			expect(getFilterStatusForItems(item)).toMatchSnapshot();
		});
	})
});
