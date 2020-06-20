//@flow
import type { Box, BoxId } from '../types';
import type { BoxCollectionRequestData } from 'modules/actions/types';

import { getBoxesList } from '../services/idbStorageService';
import { curry } from 'ramda';

const _getPaginatedBoxList = (requestData: BoxCollectionRequestData, perPage: number, orderedFilteredIdList: BoxId[]): Promise<Box[]> => {
    const {universe, page} = requestData;

    const 
        begin = (page - 1) * perPage,
        end = page * perPage,
        paginatedIdList = orderedFilteredIdList.slice(begin, end);

    return getBoxesList(universe, paginatedIdList);
};
const getPaginatedBoxList = curry(_getPaginatedBoxList);

export default getPaginatedBoxList;
