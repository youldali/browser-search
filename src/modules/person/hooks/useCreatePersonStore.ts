import { useCreateStore, UseCreateStoreQueryState } from '@browser-search/react-browser-search';
import { SimplifiedIndexConfig } from '@browser-search/browser-search';

import { Person } from '../models';
import { arrayFields, simpleFields } from '../browserSearch';

const storeId = 'Persons';
const indexConfig: SimplifiedIndexConfig<Person> = {
  simple: simpleFields,
  array: arrayFields,
}

export const useCreatePersonStore = (): [() => Promise<void>, UseCreateStoreQueryState<Person>] => {
  const [createStore, createStoreQueryState] = useCreateStore<Person>();
  const createPersonStore = () => createStore({
    storeId,
    indexConfig,
    keyPath: 'id',
  });

  return [createPersonStore, createStoreQueryState];
};
