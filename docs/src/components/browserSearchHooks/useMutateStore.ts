import * as BS from 'browser-search';
import { useContext} from 'react';
import { BrowserSearchContext } from './provider';


export const useMutateStore = <T>(storeId: BS.StoreId) => {
  const queryClient = useContext(BrowserSearchContext);

  return {
    addDataToStore: queryClient.addDataToStore<T>(storeId),
    createStore: queryClient.createStore<T>(storeId),
    deleteStore: () => queryClient.deleteStore(storeId),
  }
}