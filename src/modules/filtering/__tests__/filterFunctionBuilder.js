import {evaluateCriteria, getFilterFunctionFromFilter, createFilterFunctionDataStructure, getFilterFunctionsDataTuples, getFilterFunctionsData } from '../filterFunctionBuilder';
import getFilterStructureMap from '../../configHelpers/filterConfigResolver'
import createInterval from 'helpers/dataStructure/interval';

const box1 = {'id': 1, 'city': 'Paris', 'price': 25, forOnePerson: 1, forCouple: 0, experienceType: ['boat', 'car', 'parachute']};
const box2 = {'id': 2, 'city': 'Lyon', 'price': 40, forOnePerson: 0, forCouple: 1, experienceType: ['car']};
const box3 = {'id': 3, 'city': 'Barcelona', 'price': 120, forOnePerson: 1, forCouple: 0, experienceType: ['boat']};
const box4 = {'id': 4, 'city': 'Lyon', 'price': 199, forOnePerson: 1, forCouple: 0, experienceType: ['boat', 'plane']};
const box5 = {'id': 5, 'city': 'Dublin', 'price': 301, forOnePerson: 1, forCouple: 1, experienceType: ['parachute']};
const box6 = {'id': 6, 'city': 'Lyon', 'price': 700, forOnePerson: 0, forCouple: 1, experienceType: ['boat', 'car']};

const boxCollection = [box1, box2, box3, box4, box5, box6];

const 
	filterConfigList = [
			{ filterName:'priceRange1', filterGroup: 'price', field: 'price', operator: 'inRangeOpenClosed', operand : createInterval(0, 50) },
			{ filterName:'priceRange2', filterGroup: 'price', field: 'price', operator: 'inRangeOpenClosed', operand: createInterval(50, 100) },
			{ filterName:'priceRange3', filterGroup: 'price', field: 'price', operator: 'inRangeOpenClosed', operand: createInterval(100, 200) },
			{ filterName:'priceRange4', filterGroup: 'price', field: 'price', operator: '>', operand: 200 },

			{ filterName:'forOnePerson', filterGroup: 'person', field: 'forOnePerson', operator: '===', operand: 1 },
			{ filterName:'forCouple', filterGroup: 'person', field: 'forCouple', operator: '===', operand: 1 },

			{ filterName:'cityLyon', field: 'city', operator: '===', operand: 1 },
			{ filterName:'boatExperience', filterGroup: 'experienceType', field: 'experienceType', operator: 'contains', operand: 'boat' }
		],
		universe = 'sejour',
		filterStructureMapPromise = getFilterStructureMap(universe, filterConfigList);
		  
describe('evaluateCriteria', async () => {
	test('it should return true when the criteria is fulfilled (1)', async () => {
		const filterStructureMap = await filterStructureMapPromise;
		const target = box1;
		const filterStructure = filterStructureMap['priceRange1'];

		const isCriteriaFulfilled = evaluateCriteria(filterStructure, createInterval(0, 50))(target);
		expect(isCriteriaFulfilled).toBe(true);
	});

	test('it should return false when the criteria is not fulfilled (1)', async () => {
		const filterStructureMap = await filterStructureMapPromise;
		const target = box1;
		const filterStructure = filterStructureMap['priceRange4'];

		const isCriteriaFulfilled = evaluateCriteria(filterStructure, 200)(target);
		expect(isCriteriaFulfilled).toBe(false);
	});		


	test('it should return true when the criteria is fulfilled (2)', async () => {
		const filterStructureMap = await filterStructureMapPromise;
		const target = box5;
		const filterStructure = filterStructureMap['forCouple'];

		const isCriteriaFulfilled = evaluateCriteria(filterStructure, 1)(target);
		expect(isCriteriaFulfilled).toBe(true);
	});		

	test('it should return false when the criteria is not fulfilled (2)', async () => {
		const filterStructureMap = await filterStructureMapPromise;
		const target = box4;
		const filterStructure = filterStructureMap['forCouple'];

		const isCriteriaFulfilled = evaluateCriteria(filterStructure, 1)(target);
		expect(isCriteriaFulfilled).toBe(false);
	});		
	

	test('it should return true when the criteria is fulfilled (3)', async () => {
		const filterStructureMap = await filterStructureMapPromise;
		const target = box1;
		const filterStructure = filterStructureMap['boatExperience'];
		
		const isCriteriaFulfilled = evaluateCriteria(filterStructure, 'boat')(target);
		expect(isCriteriaFulfilled).toBe(true);
	});

	test('it should return false when the criteria is not fulfilled (3)', async () => {
		const filterStructureMap = await filterStructureMapPromise;
		const target = box2;
		const filterStructure = filterStructureMap['boatExperience'];
		
		const isCriteriaFulfilled = evaluateCriteria(filterStructure, 'boat')(target);
		expect(isCriteriaFulfilled).toBe(false)
	});	
});


describe('createFilterFunctionDataStructure', () => {
	test('it should return an object with correctly sorted filterFunctionListByGroup (group with less function first), and the corresponding Map filterFunctionListMappedToFilterGroup', () => {
		const mockFilteringFunction = () => () => {};
		const filterFunctionObject = {
			minPrice: mockFilteringFunction(),
			forCouple: mockFilteringFunction(),
			cityLyon: mockFilteringFunction(),
			maxPrice: mockFilteringFunction(),
			forSoloOnly: mockFilteringFunction(),
			id: mockFilteringFunction(),
		};

		const filterFunctionStructure = createFilterFunctionDataStructure();
		filterFunctionStructure.addFilterFunction(filterFunctionObject.minPrice);
		filterFunctionStructure.addFilterFunction(filterFunctionObject.forCouple, 'person');
		filterFunctionStructure.addFilterFunction(filterFunctionObject.cityLyon, 'location');
		filterFunctionStructure.addFilterFunction(filterFunctionObject.maxPrice);
		filterFunctionStructure.addFilterFunction(filterFunctionObject.forSoloOnly, 'person');
		filterFunctionStructure.addFilterFunction(filterFunctionObject.id);

		const {filterFunctionListByGroup, filterFunctionListMappedToFilterGroup} = filterFunctionStructure.getFilteringData();
		expect(filterFunctionListByGroup.length).toBe(5);

		const group0 = filterFunctionListByGroup[0];
		expect(group0.length).toBe(1);
		expect(group0[0]).toBe(filterFunctionObject.minPrice);
		expect(filterFunctionListMappedToFilterGroup.get(group0)).toBeUndefined();

		const group1 = filterFunctionListByGroup[1];
		expect(group1.length).toBe(1);
		expect(group1[0]).toBe(filterFunctionObject.maxPrice);
		expect(filterFunctionListMappedToFilterGroup.get(group1)).toBeUndefined();

		const group2 = filterFunctionListByGroup[2];
		expect(group2.length).toBe(1);
		expect(group2[0]).toBe(filterFunctionObject.id);
		expect(filterFunctionListMappedToFilterGroup.get(group2)).toBeUndefined();

		const group3 = filterFunctionListByGroup[3];
		expect(group3.length).toBe(1);
		expect(group3[0]).toBe(filterFunctionObject.cityLyon);
		expect(filterFunctionListMappedToFilterGroup.get(group3)).toBe('location');

		const group4 = filterFunctionListByGroup[4];
		expect(group4.length).toBe(2);
		expect(group4[0]).toBe(filterFunctionObject.forCouple);
		expect(group4[1]).toBe(filterFunctionObject.forSoloOnly);
		expect(filterFunctionListMappedToFilterGroup.get(group4)).toBe('person');

	});		
});


describe('getFilterFunctionsData', () => {
	test('it should get the correct FilterData', async () => {
		const 
			filterStructureMap = await filterStructureMapPromise,
			appliedFilters = {
				priceRange1: createInterval(0, 50),
				priceRange2: createInterval(50, 100),
				forCouple: 1,
				cityLyon: 1
			};

		const {filterFunctionListByGroup, filterFunctionListMappedToFilterGroup} = getFilterFunctionsData(filterStructureMap, appliedFilters);
		expect(filterFunctionListByGroup.length).toBe(3);
		
		const group0 = filterFunctionListByGroup[0];
		expect(group0.length).toBe(1);
		expect(filterFunctionListMappedToFilterGroup.get(group0)).toBeUndefined();

		const group1 = filterFunctionListByGroup[1];
		expect(group1.length).toBe(1);
		expect(filterFunctionListMappedToFilterGroup.get(group1)).toBe('person');

		const group2 = filterFunctionListByGroup[2];
		expect(group2.length).toBe(2);
		expect(filterFunctionListMappedToFilterGroup.get(group2)).toBe('price');
	});		
});
