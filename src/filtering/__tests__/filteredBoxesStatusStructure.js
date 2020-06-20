import createBoxesFilteredStatusStructure from '../filteredBoxesStatusStructure';

describe('filterStatistic', () => {
	test('Should return the proper statistic of each status', () => {
        const boxesFilteredStatusStructure = createBoxesFilteredStatusStructure();

        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: true}, 1);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: true}, 5);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: true}, 10);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: true}, 15);

        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false}, 2);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false}, 3);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false}, 4);

        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false, filterGroupRejected: 'group1'}, 6);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false, filterGroupRejected: 'group1'}, 7);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false, filterGroupRejected: 'group1'}, 8);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false, filterGroupRejected: 'group1'}, 9);

        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false, filterGroupRejected: 'group2'}, 11);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false, filterGroupRejected: 'group2'}, 12);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false, filterGroupRejected: 'group2'}, 13);
        boxesFilteredStatusStructure.addFilteredObjectStatus({pass: false, filterGroupRejected: 'group2'}, 14);

        const expectedMap = new Map();
        expectedMap
            .set(true, [1,5,10,15])
            .set(false, [2,3,4])
            .set('group1', [6,7,8,9])
            .set('group2', [11,12,13,14]);

        expect(boxesFilteredStatusStructure.getBoxesIdMappedByFilteredStatus()).toEqual(expectedMap);
    });
    
    test('Should set the status of a list of Ids', () => {
        const boxesFilteredStatusStructure = createBoxesFilteredStatusStructure();

        boxesFilteredStatusStructure.setStatusValue({pass: true}, [1, 2, 3, 4, 5]);
        boxesFilteredStatusStructure.setStatusValue({pass: false, filterGroupRejected: 'price'}, [6, 7, 8]);
        boxesFilteredStatusStructure.setStatusValue({pass: false}, [9]);

        const expectedMap = new Map();
        expectedMap
            .set(true, [1, 2, 3, 4, 5])
            .set(false, [9])
            .set('price', [6,7,8]);

        expect(boxesFilteredStatusStructure.getBoxesIdMappedByFilteredStatus()).toEqual(expectedMap);
	});
});