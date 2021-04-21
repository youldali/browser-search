import { getFilterStatusFromFilterConfig } from '../index';
import { eitherAsyncFilterConfigDataFixture, itemsFixture, Item } from './__fixtures__/fixtures';
import { FilterConfigData } from 'modules/filterConfiguration';

describe('getFilterStatusForItem', () => {
	let filterConfigDataFixture: FilterConfigData<Item>;

  beforeAll( () => (
    eitherAsyncFilterConfigDataFixture
      .run()
      .then(eitherFilterConfigDataFixture => {
        filterConfigDataFixture = eitherFilterConfigDataFixture.extract() as FilterConfigData<Item>;
      })
  ));

	itemsFixture.forEach( item => {
		test(`correct filterStatus for item: ${JSON.stringify(item)}`, () => {
			const getFilterStatusForItem = getFilterStatusFromFilterConfig(filterConfigDataFixture);
			expect(getFilterStatusForItem(item)).toMatchSnapshot();
		});
	})
});
