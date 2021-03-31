jest.mock('helpers/storage/idbStorage');
jest.mock('../../services/fetchBoxListService');

import getPaginatedBoxList from '../pagination';
import { boxCollection } from '../../services/__mocks__/fetchBoxListService';

describe('getPaginatedBoxList', () => {
	test('Should return the items matching the IDs of the correct slice of the list', () => {
        const 
            page = 1,
            perPage = 3,
            universe = 'sejour',
            requestData = {universe, page},
            orderedFilteredIdList = [5,1,3,9,8];

        const 
            paginatedGiftList = getPaginatedBoxList(requestData, perPage, orderedFilteredIdList),
            expected = [boxCollection[4], boxCollection[0], boxCollection[2]];
		return expect(paginatedGiftList).resolves.toEqual(expected);
    });

    test('Should return the items matching the IDs of the correct slice of the list (2)', () => {
        const 
            page = 2,
            perPage = 4,
            universe = 'sejour',
            requestData = {universe, page},
            orderedFilteredIdList = [5, 1, 3, 9, 8, 2, 10];

        const 
            paginatedGiftList = getPaginatedBoxList(requestData, perPage, orderedFilteredIdList),
            expected = [boxCollection[7], boxCollection[1], boxCollection[9]];
		return expect(paginatedGiftList).resolves.toEqual(expected);
    });
});