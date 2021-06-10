import { NextFilterState } from '../../modules/filteringData';

export type NextFilterStateStat = Omit<NextFilterState, 'documentIds'> & {nextNumberOfDocuments: number};

export type ResponseSuccess<T> = { 
  outcome: 'success', 
  payload: {
    documents: T[],
    stats: Dictionary<NextFilterStateStat>,
    numberOfDocuments: number,
  },
}

export type ResponseFailure = { 
  outcome: 'error', 
  reason: Error,
}