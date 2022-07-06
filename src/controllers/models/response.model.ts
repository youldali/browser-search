export type CacheStatus = 'none' | 'partial' | 'total';

export type NextFilterStateStat = { 
  type: 'added';
  nextDocumentsAdded: number;
} |
{
  type: 'narrowed';
  nextNumberOfDocuments: number;
} |
{
  type: 'matching';
  matchingNumberOfDocuments: number;
}
;

export type ResponseSuccess<T, TFilterId extends string = string> = { 
  outcome: 'success', 
  payload: {
    documents: T[],
    stats: Record<TFilterId, NextFilterStateStat>,
    numberOfDocuments: number,
    _cacheStatus_: CacheStatus
  },
}

export type ResponseFailure = { 
  outcome: 'error', 
  reason: string,
}

export type Response<T> = ResponseSuccess<T> | ResponseFailure;