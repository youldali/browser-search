export type CacheStatus = 'none' | 'partial' | 'total';

export type NextFilterStateStat = { 
  type: 'added';
  nextDocumentsAdded: number;
} |
{
  type: 'narrowed';
  nextNumberOfDocuments: number;
};

export type ResponseSuccess<T> = { 
  outcome: 'success', 
  payload: {
    documents: T[],
    stats: Dictionary<NextFilterStateStat>,
    numberOfDocuments: number,
    _cacheStatus_: CacheStatus
  },
}

export type ResponseFailure = { 
  outcome: 'error', 
  reason: Error,
}