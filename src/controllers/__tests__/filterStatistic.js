jest.mock('helpers/storage/idbStorage');
jest.mock('../../services/fetchBoxListService');

import getFiltersStatistics, { getFiltersStatisticsSimplified } from '../filterStatistic';
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

        { filterName:'cityLyon', field: 'city', operator: '===', operand: 'Lyon' },
        { filterName:'boatExperience', filterGroup: 'experienceType', field: 'experienceType', operator: 'contains', operand: 'boat' },
        { filterName:'carExperience', filterGroup: 'experienceType', field: 'experienceType', operator: 'contains', operand: 'car' },
        { filterName:'planeExperience', filterGroup: 'experienceType', field: 'experienceType', operator: 'contains', operand: 'plane' },
        { filterName:'parachuteExperience', filterGroup: 'experienceType', field: 'experienceType', operator: 'contains', operand: 'parachute' }
    ],
	universe = 'sejour',
    filterStructureMapPromise = getFilterStructureMap(universe, filterConfigList);
    
describe('getFiltersStatistics', () => {
	test('should return the correct filter statistic (1)', async () => {
        const 
            filterStructureMap = await filterStructureMapPromise,
            filtersApplied = {cityLyon: 'Lyon'},
            requestData = {filtersApplied, universe};


        const filteredObjectIdsMappedByGroup = new Map()
            .set(true, [1, 2, 7, 8, 10])
            .set(false, [3, 4, 5, 6, 9]);


        const expected = {
            boatExperience: { type: 'absolute', idList: [1, 7, 8, 10] },
            carExperience: { type: 'absolute', idList: [1, 2, 7, 8] },
            parachuteExperience: { type: 'absolute', idList: [1] },
            planeExperience: { type: 'absolute', idList: [7, 10] },
            cityLyon: { type: 'absolute', idList: [2, 7, 8] },
            forCouple: { type: 'absolute', idList: [2, 7, 8, 10] },
            forOnePerson: { type: 'absolute', idList: [1] },
            priceRange1: { type: 'absolute', idList: [1, 2] },
            priceRange2: { type: 'absolute', idList: [] },
            priceRange3: { type: 'absolute', idList: [] },
            priceRange4: { type: 'absolute', idList: [7, 8, 10] },
        };
        const filterStatistic = getFiltersStatistics(requestData, filterStructureMap, filteredObjectIdsMappedByGroup);

		return expect(filterStatistic).resolves.toEqual(expected);
    });


    test('should return the correct filter statistic (1)', async () => {
        const 
            filterStructureMap = await filterStructureMapPromise,
            filtersApplied = {priceRange4: 200, boatExperience: 'boat'},
            requestData = {filtersApplied, universe};


        const filteredObjectIdsMappedByGroup = new Map()
            .set(true, [6, 7, 8, 10])
            .set(false, [2])
            .set('price', [1, 3, 4])
            .set('experienceType', [5, 9]);


        const expected = {
            boatExperience: { type: 'absolute', idList: [6, 7, 8, 10] },
            carExperience: { type: 'relative', idList: [] },
            parachuteExperience: { type: 'relative', idList: [5] },
            planeExperience: { type: 'relative', idList: [9] },
            cityLyon: { type: 'absolute', idList: [6, 7, 8] },
            forCouple: { type: 'absolute', idList: [6, 7, 8, 10] },
            forOnePerson: { type: 'absolute', idList: [] },
            priceRange1: { type: 'relative', idList: [1] },
            priceRange2: { type: 'relative', idList: [] },
            priceRange3: { type: 'relative', idList: [3, 4] },
            priceRange4: { type: 'absolute', idList: [6, 7, 8, 10] },
        };
        const filterStatistic = getFiltersStatistics(requestData, filterStructureMap, filteredObjectIdsMappedByGroup);

		return expect(filterStatistic).resolves.toEqual(expected);
    });
});


describe('getFiltersStatisticsSimplified', () => {
	test('should return the number of box matching each filter', () => {
        const filtersStatisticsDetailed = {
            boatExperience: { type: 'absolute', idList: [1, 7, 8, 10] },
            forOnePerson: { type: 'absolute', idList: [1] },
            priceRange1: { type: 'absolute', idList: [1, 2] },
            priceRange2: { type: 'absolute', idList: [] },
        };

        const expected = {
            boatExperience: { type: 'absolute', number: 4 },
            forOnePerson: { type: 'absolute', number: 1 },
            priceRange1: { type: 'absolute', number: 2 },
            priceRange2: { type: 'absolute', number: 0 },
        }
        const filtersStatisticsSimplified = getFiltersStatisticsSimplified(filtersStatisticsDetailed);

		return expect(filtersStatisticsSimplified).toEqual(expected);
    });
});