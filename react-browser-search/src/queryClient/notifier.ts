import * as BS from 'browser-search';

export type Listener = () => void; 
export type StoreListeners = Map<BS.StoreId, Listener[]>;


export const buildNotifier = () => {
  let storeListeners: StoreListeners = new Map();

  const notifyStoreChange = (storeId: BS.StoreId): void => {
    const listeners = storeListeners.get(storeId) ?? [];
    listeners.forEach(callback => callback())
  }

  const addStoreListener = (storeId: BS.StoreId) => (listener: Listener): void => {
    const listeners = storeListeners.get(storeId) ?? [];
    listeners.push(listener)
    storeListeners.set(storeId, listeners);
  }

  const removeStoreListener = (storeId: BS.StoreId) => (listenerToRemove: Listener): void => {
    const listeners = storeListeners.get(storeId) ?? [];
    const filteredListeners = listeners.filter(listener => listener !== listenerToRemove );
    storeListeners.set(storeId, filteredListeners);
  }

  return {
    notifyStoreChange,
    addStoreListener,
    removeStoreListener,
  }
}


 