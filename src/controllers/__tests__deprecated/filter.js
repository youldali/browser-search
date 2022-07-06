jest.mock('helpers/storage/idbStorage');
jest.mock('../../services/fetchBoxListService');

import getBoxesIdMappedByFilterStatus from '../filter';
import getFilterStructureMap from '../../configHelpers/filterConfigResolver'
import createInterval from 'helpers/dataStructure/interval';

const 
	filterConfigList = [
		{ filterName:'priceRange1', filterGroup: 'price', field: 'price', operator: 'inRangeOpenClosed', operand : createInterval(0, 50) },
		{ filterName:'priceRange2', filterGroup: 'price', field: 'price', operator: 'inRangeOpenClosed', operand: createInterval(50, 100) },
		{ filterName:'priceRange3', filterGroup: 'price', field: 'price', operator: 'inRangeOpenClosed', operand: createInterval(100, 200) },
		{ filterName:'priceRange4', filterGroup: 'price', field: 'price', operator: '>', operand: 200 },

		{ filterName:'forOnePerson', filterGroup: 'person', field: 'forOnePerson', operator: '===', operand: 1 },
		{ filterName:'forCouple', filterGroup: 'person', field: 'forCouple', operator: '===', operand: 1 },

		{ filterName:'city', field: 'city', operator: '===', operand: undefined },
		{ filterName:'boatExperience', filterGroup: 'experienceType', field: 'experienceType', operator: 'contains', operand: 'boat' },
		{ filterName:'carExperience', filterGroup: 'experienceType', field: 'experienceType', operator: 'contains', operand: 'car' },
		{ filterName:'planeExperience', filterGroup: 'experienceType', field: 'experienceType', operator: 'contains', operand: 'plane' },
		{ filterName:'parachuteExperience', filterGroup: 'experienceType', field: 'experienceType', operator: 'contains', operand: 'parachute' }
	],
	universe = 'sejour',
	filterStructureMapPromise = getFilterStructureMap(universe, filterConfigList);
	

describe('getBoxesIdMappedByFilterStatus', () => {
	test('Should return filter statistic structure when no filter is applied', async () => {
		const 
			filterStructureMap = await filterStructureMapPromise,
            filtersApplied = {},
            requestData = {filtersApplied, universe};

		const 
			result = getBoxesIdMappedByFilterStatus(requestData, filterStructureMap),
			expectedMap = new Map();

			expectedMap
			.set(true, [1,2, 3,4,5,6,7,8,9,10])
			.set(false, []);

		return expect(result).resolves.toEqual(expectedMap);
	});


	test('Should return filter statistic structure matching the filters applied (1)', async () => {
		const 
			filterStructureMap = await filterStructureMapPromise,
            filtersApplied = {priceRange1: createInterval(0, 50)},
            requestData = {filtersApplied, universe};

		const 
			result = getBoxesIdMappedByFilterStatus(requestData, filterStructureMap),
			expectedMap = new Map();

			expectedMap
			.set(true, [1,2])
			.set(false, [])
			.set('price', [3,4,5,6,7,8,9,10]);

		return expect(result).resolves.toEqual(expectedMap);
	});

	test('Should return filter statistic structure matching the filters applied (2)', async () => {
		const 
			filterStructureMap = await filterStructureMapPromise,
            filtersApplied = {priceRange4: 200, city: "Lyon", parachuteExperience: 'parachute', planeExperience: 'plane'},
            requestData = {filtersApplied, universe};

		const 
			result = getBoxesIdMappedByFilterStatus(requestData, filterStructureMap),
			expectedMap = new Map();

			expectedMap
			.set(true, [7])
			.set(false, [1, 2, 3, 5, 9, 10])
			.set('price', [4])
			.set('experienceType', [6, 8]);
			
		return expect(result).resolves.toEqual(expectedMap);
	});		
});