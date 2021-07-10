export declare type CacheStatus = 'none' | 'partial' | 'total';
export declare type NextFilterStateStat = {
    type: 'added';
    nextDocumentsAdded: number;
} | {
    type: 'narrowed';
    nextNumberOfDocuments: number;
} | {
    type: 'matching';
    matchingNumberOfDocuments: number;
};
export declare type ResponseSuccess<T> = {
    outcome: 'success';
    payload: {
        documents: T[];
        stats: Record<string, NextFilterStateStat>;
        numberOfDocuments: number;
        _cacheStatus_: CacheStatus;
    };
};
export declare type ResponseFailure = {
    outcome: 'error';
    reason: Error;
};
export declare type Response<T> = ResponseSuccess<T> | ResponseFailure;
