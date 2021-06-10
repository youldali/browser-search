import { NextFilterState } from '../../modules/filteringData';
export declare type NextFilterStateStat = Omit<NextFilterState, 'documentIds'> & {
    nextNumberOfDocuments: number;
};
export declare type ResponseSuccess<T> = {
    outcome: 'success';
    payload: {
        documents: T[];
        stats: Dictionary<NextFilterStateStat>;
        numberOfDocuments: number;
    };
};
export declare type ResponseFailure = {
    outcome: 'error';
    reason: Error;
};
