import getFilterStatusForItem from '../filterStatus';
import { filterFunctionCollectionFixture } from '../__fixtures__/filter.fixture';

const falseThunk: FilterFunction = (_) => false;
const trueThunk: FilterFunction = (_) => true;

describe('getFilterStatusForItem', () => {
	test('Should return a filterStatus to true if it receives true all', () => {
		const filterCollectionGroup1 = [trueThunk, falseThunk, trueThunk];	
		const filterCollectionGroup2 = [trueThunk, falseThunk];

		const filterFunctionListMapped = new Map()
			.set(filterCollectionGroup1, 'group1')
			.set(filterCollectionGroup2, 'group2');

		const filterFunctionListByGroup = [filterCollectionGroup1, filterCollectionGroup2];
		const filterStatus = getFilterStatusForItem(filterFunctionListByGroup)(filterFunctionListMapped)({});

		expect(filterStatus).toEqual({pass: true});
	});

	test('Should return a filterStatus to false, and the filterGroup that failed if only one failed', () => {
		const filterCollectionGroup1 = [trueThunk, falseThunk, trueThunk];	
		const filterCollectionGroup2 = [falseThunk, trueThunk];
		const filterCollectionGroup3 = [falseThunk];

		const filterFunctionListMapped = new Map()
			.set(filterCollectionGroup1, 'group1')
			.set(filterCollectionGroup2, 'group2')
			.set(filterCollectionGroup3, 'group3');

		const filterFunctionListByGroup = [filterCollectionGroup1, filterCollectionGroup2, filterCollectionGroup3];
		const filterStatus = getFilterStatusForItem(filterFunctionListByGroup)(filterFunctionListMapped)({});

		expect(filterStatus).toEqual({pass: false, filterGroupRejected: 'group3'});
	});

	test('Should return a filterStatus to false and no filter group if at least 2 groups of filter failed', () => {
		const filterCollectionGroup1 = [trueThunk, falseThunk, trueThunk];	
		const filterCollectionGroup2 = [falseThunk, trueThunk];
		const filterCollectionGroup3 = [falseThunk];
		const filterCollectionGroup4 = [falseThunk];

		const filterFunctionListMapped = new Map()
			.set(filterCollectionGroup1, 'group1')
			.set(filterCollectionGroup2, 'group2')
			.set(filterCollectionGroup3, 'group3')
			.set(filterCollectionGroup4, 'group4');

		const filterFunctionListByGroup = [filterCollectionGroup1, filterCollectionGroup2, filterCollectionGroup3, filterCollectionGroup4];
		const filterStatus = getFilterStatusForItem(filterFunctionListByGroup)(filterFunctionListMapped)({});

		expect(filterStatus).toEqual({pass: false});
	});
});