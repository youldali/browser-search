import { useEffect } from 'react';
import { useMutateStore } from 'react-browser-search';

import { Person } from '../models';
import { arrayFields, simpleFields } from '../browserSearch';

export const useCreatePersonStore = () => {
  const mutateStore = useMutateStore<Person>('Persons');

  useEffect(() => {
    mutateStore.createStore({
      simple: simpleFields,
      array: arrayFields,
    })('id');
  }, []) 
};
