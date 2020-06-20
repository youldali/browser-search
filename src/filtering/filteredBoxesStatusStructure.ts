//@flow

import type { BoxId, BoxesIdMappedByFilteredStatus, FilteredBoxStatus, FilterGroup } from '../types';

export
const createBoxesFilteredStatusStructure = (filterGroupList: FilterGroup[] = []) => {
    const
        initMapStructure = (filterGroupList: FilterGroup[]): BoxesIdMappedByFilteredStatus => {
            const boxesIdMappedByFilteredStatus: BoxesIdMappedByFilteredStatus = new Map();
            boxesIdMappedByFilteredStatus
                .set(true, [])
                .set(false, []);

            filterGroupList.forEach(filterGroup => boxesIdMappedByFilteredStatus.set(filterGroup, []));

            return boxesIdMappedByFilteredStatus;
        },

        addToBoolean = (hasPassed: boolean, id: BoxId) => {
            // $FlowFixMe
            boxesIdMappedByFilteredStatus
                .get(hasPassed)
                .push(id);
            
            return this;
        },

        addToGroup = (group: FilterGroup, id: BoxId) => {
            const listForGroup = boxesIdMappedByFilteredStatus.get(group);
            listForGroup 
                ? listForGroup.push(id)
                : boxesIdMappedByFilteredStatus.set(group, [id]);

            return this;
        };

    const boxesIdMappedByFilteredStatus = initMapStructure(filterGroupList);
    return {
        addFilteredObjectStatus(filteredBoxStatus: FilteredBoxStatus, id: BoxId){
            return (
                filteredBoxStatus.pass 
                    ? addToBoolean(true, id) :
                filteredBoxStatus.filterGroupRejected 
                    ? addToGroup(filteredBoxStatus.filterGroupRejected, id) : addToBoolean(false, id)
            );
        },

        setStatusValue(filteredBoxStatus: FilteredBoxStatus, idList: BoxId[]){
            filteredBoxStatus.filterGroupRejected ? boxesIdMappedByFilteredStatus.set(filteredBoxStatus.filterGroupRejected, idList) : boxesIdMappedByFilteredStatus.set(filteredBoxStatus.pass, idList);

            return this;
        },

        getBoxesIdMappedByFilteredStatus(): BoxesIdMappedByFilteredStatus {
            return new Map(boxesIdMappedByFilteredStatus);
        }
    };
};
export default createBoxesFilteredStatusStructure;