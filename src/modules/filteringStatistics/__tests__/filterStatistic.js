import getFilterStatistic from '../filterStatistic';

describe('getOrderedList', () => {
	test('Should return the filter statistic for independent filter', () => {
        const 
            boxesIdListMatchingFilter = [5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 25],
            filterGroup = undefined,
            isFilterSelected = false,
            boxesIdMappedByFilteredStatus = new Map();

        boxesIdMappedByFilteredStatus
            .set(true, [7, 8, 10, 11, 12, 14, 24, 35]);
            
        const 
            filterOperandStats = getFilterStatistic(boxesIdMappedByFilteredStatus, boxesIdListMatchingFilter, isFilterSelected, filterGroup),
            expected = {
                type: 'absolute',
                idList: [7, 8, 10, 24]
            };
		return expect(filterOperandStats).toEqual(expected);
    });

    test('Should return the filter statistic for group filter not selected', () => {
        const 
            boxesIdListMatchingFilter = [5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 25],
            filterGroup = 'price',
            isFilterSelected = false,
            boxesIdMappedByFilteredStatus = new Map();

        boxesIdMappedByFilteredStatus
            .set(true, [7, 8, 10, 11, 12, 14, 24, 35])
            .set('price', [22, 23, 25, 50, 51]);
            
        const 
            filterOperandStats = getFilterStatistic(boxesIdMappedByFilteredStatus, boxesIdListMatchingFilter, isFilterSelected, filterGroup),
            expected = {
                type: 'relative',
                idList: [22, 23, 25]
            };
		return expect(filterOperandStats).toEqual(expected);
    });

    test('Should return the filter statistic for group filter selected', () => {
        const 
            boxesIdListMatchingFilter = [5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 25],
            filterGroup = 'price',
            isFilterSelected = true,
            boxesIdMappedByFilteredStatus = new Map();

        boxesIdMappedByFilteredStatus
            .set(true, [7, 8, 10, 11, 12, 14, 24, 35])
            .set('price', [22, 23, 25, 50, 51]);
            
        const 
            filterOperandStats = getFilterStatistic(boxesIdMappedByFilteredStatus, boxesIdListMatchingFilter, isFilterSelected, filterGroup),
            expected = {
                type: 'absolute',
                idList: [7, 8, 10, 24]
            };
		return expect(filterOperandStats).toEqual(expected);
    });

    test('Should return the filter statistic for group filter when no other filter in group is selected', () => {
        const 
            boxesIdListMatchingFilter = [5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 25],
            filterGroup = 'price',
            isFilterSelected = true,
            boxesIdMappedByFilteredStatus = new Map();

        boxesIdMappedByFilteredStatus
            .set(true, [7, 8, 10, 11, 12, 14, 24, 35]);
                        
        const 
            filterOperandStats = getFilterStatistic(boxesIdMappedByFilteredStatus, boxesIdListMatchingFilter, isFilterSelected, filterGroup),
            expected = {
                type: 'absolute',
                idList: [7, 8, 10, 24]
            };
		return expect(filterOperandStats).toEqual(expected);
    });
});
