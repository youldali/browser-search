export declare type CacheStatus = 'none' | 'partial' | 'total';
export declare type NextFilterStateStat = {
    type: 'added';
    nextDocumentsAdded: number;
} | {
    type: 'narrowed';
    nextNumberOfDocuments: number;
};
export declare type ResponseSuccess<T> = {
    outcome: 'success';
    payload: {
        documents: T[];
        stats: Dictionary<NextFilterStateStat>;
        numberOfDocuments: number;
        _cacheStatus_: CacheStatus;
    };
};
export declare type ResponseFailure = {
    outcome: 'error';
    reason: Error;
};
