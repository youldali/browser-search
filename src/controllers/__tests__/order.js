jest.mock('helpers/storage/idbStorage');
jest.mock('../../services/fetchBoxListService');

import getOrderedBoxIdList from '../order';

describe('getOrderedBoxIdList', () => {
	test('Should return the filtered list in correct order by price ASC', () => {
        const 
            orderBy = 'price',
            universe = 'sejour',
            requestData = {orderBy, universe},
            itemIdListValidated = [1, 3, 4, 7, 8, 9];

        const 
            orderedFilteredIdList = getOrderedBoxIdList(requestData, itemIdListValidated),
            expected = [1, 3, 4, 7, 8, 9];

		return expect(orderedFilteredIdList).resolves.toEqual(expected);
    });
    
    test('Should return the filtered list in correct order by price DESC', () => {
        const 
            orderBy = '-price',
            universe = 'sejour',
            requestData = {orderBy, universe},
            itemIdListValidated = [1, 3, 4, 7, 8, 9];

        const 
            orderedFilteredIdList = getOrderedBoxIdList(requestData, itemIdListValidated),
            expected = [9, 8, 7, 4, 3, 1];
		return expect(orderedFilteredIdList).resolves.toEqual(expected);
    });
    
    test('Should return the filtered list in correct order by city ASC', () => {
        const 
            orderBy = 'city',
            universe = 'sejour',
            requestData = {orderBy, universe},
            itemIdListValidated = [2, 3, 5, 6, 7, 10];

        const 
            orderedFilteredIdList = getOrderedBoxIdList(requestData, itemIdListValidated),
            expected = [3, 10, 5, 2, 6, 7];
		return expect(orderedFilteredIdList).resolves.toEqual(expected);
	});
});