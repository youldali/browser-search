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
  },
}

export type ResponseFailure = { 
  outcome: 'error', 
  reason: Error,
}