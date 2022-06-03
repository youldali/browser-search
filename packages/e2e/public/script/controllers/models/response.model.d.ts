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
export declare type ResponseSuccess<T, TFilterId extends string = string> = {
    outcome: 'success';
    payload: {
        documents: T[];
        stats: Record<TFilterId, NextFilterStateStat>;
        numberOfDocuments: number;
        _cacheStatus_: CacheStatus;
    };
};
export declare type ResponseFailure = {
    outcome: 'error';
    reason: string;
};
export declare type Response<T> = ResponseSuccess<T> | ResponseFailure;
