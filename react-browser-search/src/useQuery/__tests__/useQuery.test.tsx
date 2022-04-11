import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import {
    getErrorStateFixture, getIdleStateFixture, getLoadingStateFixture, getRequestFixture,
    getResponseFixture, getStaleStateFixture, getSuccessStateFixture,
} from '../../__fixtures__';
import {
    buildReducer, ErrorQueryState, IdleState, LoadingQueryState, SearchCompletedAction,
    SearchFailedAction, SearchStartedAction, StaleQueryState, SuccessQueryState, useQuery,
} from '../useQuery';
import { useMutateStore } from '../../useMutateStore';
import { BrowserSearchProvider } from '../../provider/__mocks__';

jest.mock('../../queryClient');

const createWrapper = () => ({ children }: { children?: React.ReactNode }) => <BrowserSearchProvider>{children}</BrowserSearchProvider>


describe ('useQuery', () => {

  const storeId = 'storeId';

  it('returns loading and success states when the promise is resolved', async () => {
    const request = getRequestFixture();
    const {result, waitForNextUpdate} = renderHook(() => useQuery(request), {wrapper: createWrapper()})

    const loadingState = result.current as LoadingQueryState<unknown>;
    expect(loadingState.status).toBe('loading');
    expect(loadingState.request).toBe(request);

    await waitForNextUpdate();

    const successState = result.current as SuccessQueryState<unknown>;
    expect(successState.status).toBe('success');
    expect(successState.request).toBe(request);
  })

  it('returns the same response (from the cache) when 2 identical requests are made', async () => {
    const requestA = getRequestFixture();
    const renderHookResultA = renderHook(() => useQuery(requestA), {wrapper: createWrapper()})
    await renderHookResultA.waitForNextUpdate();
    const successStateA = renderHookResultA.result.current as SuccessQueryState<unknown>;
    const responseA = successStateA.response;

    const requestB = getRequestFixture();
    const renderHookResultB = renderHook(() => useQuery(requestB), {wrapper: createWrapper()})
    await renderHookResultB.waitForNextUpdate();
    const successStateB = renderHookResultA.result.current as SuccessQueryState<unknown>;
    const responseB = successStateB.response;

    expect(responseA).toBe(responseB);
  })

  it('does not return the request from the cache when the store has been mutated', async () => {
    const request = getRequestFixture({storeId});
    const {result: {current: mutateStore}} = renderHook(() => useMutateStore(storeId), {wrapper: createWrapper()})

    const renderHookResultA = renderHook(() => useQuery(request), {wrapper: createWrapper()})
    await renderHookResultA.waitForNextUpdate();
    const successStateA = renderHookResultA.result.current as SuccessQueryState<unknown>;
    const responseA = successStateA.response;

    await act(() => {mutateStore.addDataToStore([])});

    const renderHookResultB = renderHook(() => useQuery(request), {wrapper: createWrapper()})
    await renderHookResultB.waitForNextUpdate();
    const successStateB = renderHookResultA.result.current as SuccessQueryState<unknown>;
    const responseB = successStateB.response;

    expect(responseA).not.toBe(responseB);
  })

  it('refreshes the response when the store has been mutated', async () => {
    const request = getRequestFixture({storeId});
    const {result: {current: mutateStore}} = renderHook(() => useMutateStore(storeId), {wrapper: createWrapper()})

    const renderHookResult = renderHook(() => useQuery(request), {wrapper: createWrapper()})
    await renderHookResult.waitForNextUpdate();
    const successState = renderHookResult.result.current as SuccessQueryState<unknown>;
    const responseA = successState.response;

    await act(() => {mutateStore.addDataToStore([])});

    const successStateB = renderHookResult.result.current as SuccessQueryState<unknown>;
    expect(responseA).not.toBe(successStateB.response);

  })

});




describe ('reducer', () => {
  const reducer = buildReducer();
  
  describe('From idle state', () => {
    it('To loading state', async () => {
      const idleState = getIdleStateFixture();
      const searchStartedAction: SearchStartedAction<unknown> = {type: 'searchStarted', request: getRequestFixture(), abort: jest.fn()};
      const expectedState = getLoadingStateFixture({
        request: searchStartedAction.request,
        abort: searchStartedAction.abort,
      });
  
      expect(reducer(idleState, searchStartedAction)).toEqual(expectedState);
    })
  });

  describe('From loading state', () => {
    it('to next loading state and aborts the previous request is they are different', async () => {
      const searchStartedAction: SearchStartedAction<unknown> = {type: 'searchStarted', request: getRequestFixture(), abort: jest.fn()};
      const loadingState = getLoadingStateFixture({
        request: getRequestFixture({
          filtersApplied: ['random-filter'],
        }),
        abort: jest.fn()
      });
      const expectedState = getLoadingStateFixture({
        request: searchStartedAction.request,
        abort: searchStartedAction.abort,
      });
  
      expect(reducer(loadingState, searchStartedAction)).toEqual(expectedState);
      expect(loadingState.abort).toHaveBeenCalledTimes(1);
    })

    it('to next loading state and does not abort the previous request is they are equal', async () => {
      const searchStartedAction: SearchStartedAction<unknown> = {type: 'searchStarted', request: getRequestFixture(), abort: jest.fn()};
      const loadingState = getLoadingStateFixture({
        request: getRequestFixture(),
        abort: jest.fn()
      });
      const expectedState = getLoadingStateFixture({
        request: searchStartedAction.request,
        abort: searchStartedAction.abort,
      });
  
      expect(reducer(loadingState, searchStartedAction)).toEqual(expectedState);
      expect(loadingState.abort).not.toHaveBeenCalled();
    })
  
    it('remains unchanged when the search completed is not the last one started (prevents race condition)', async () => {
      const searchCompletedAction: SearchCompletedAction<unknown> = {type: 'searchCompleted', request: getRequestFixture(), response: getResponseFixture()};
      const loadingState = getLoadingStateFixture();
      const expectedState = loadingState;
  
      expect(reducer(loadingState, searchCompletedAction)).toEqual(expectedState);
    })
  
    it('remains unchanged when the search failed is not the last one started (prevents race condition)', async () => {
      const searchFailedAction: SearchFailedAction<unknown> = {type: 'searchFailed', request: getRequestFixture(), error: new Error()};
      const loadingState = getLoadingStateFixture();
      const expectedState = loadingState;
  
      expect(reducer(loadingState, searchFailedAction)).toEqual(expectedState);
    })
  
    it('to success state', async () => {
      const searchCompletedAction: SearchCompletedAction<unknown> = {type: 'searchCompleted', request: getRequestFixture(), response: getResponseFixture()};
      const loadingState = getLoadingStateFixture({
        request: searchCompletedAction.request
      });
      const expectedState = getSuccessStateFixture({
        request: searchCompletedAction.request,
        response: searchCompletedAction.response,
      });
  
      expect(reducer(loadingState, searchCompletedAction)).toEqual(expectedState);
    })

    it('to error state', async () => {
      const searchFailedAction: SearchFailedAction<unknown> = {type: 'searchFailed', request: getRequestFixture(), error: new Error()};
      const loadingState = getLoadingStateFixture({
        request: searchFailedAction.request,
      });
      const expectedState = getErrorStateFixture({
        request: searchFailedAction.request,
        error: searchFailedAction.error,
      });
  
      expect(reducer(loadingState, searchFailedAction)).toEqual(expectedState);
    })
  });

  describe('From stale state', () => {
    it('to next stale state and aborts the previous request is they are different', async () => {
      const searchStartedAction: SearchStartedAction<unknown> = {type: 'searchStarted', request: getRequestFixture(), abort: jest.fn()};
      const staleState = getStaleStateFixture({
        newRequest: getRequestFixture({
          filtersApplied: ['random-filter'],
        }),
        abort: jest.fn()
      });
      const expectedState = getStaleStateFixture({
        newRequest: searchStartedAction.request,
        abort: searchStartedAction.abort,
      });
  
      expect(reducer(staleState, searchStartedAction)).toEqual(expectedState);
      expect(staleState.abort).toHaveBeenCalledTimes(1);
    })

    it('to next stale state and does not abort the previous request is they are equal', async () => {
      const searchStartedAction: SearchStartedAction<unknown> = {type: 'searchStarted', request: getRequestFixture(), abort: jest.fn()};
      const staleState = getStaleStateFixture({
        newRequest: getRequestFixture(),
        abort: jest.fn()
      });
      const expectedState = getStaleStateFixture({
        newRequest: searchStartedAction.request,
        abort: searchStartedAction.abort,
      });
  
      expect(reducer(staleState, searchStartedAction)).toEqual(expectedState);
      expect(staleState.abort).not.toHaveBeenCalled();
    })
  
    it('remains unchanged when the search completed is not the last one started (prevents race condition)', async () => {
      const searchCompletedAction: SearchCompletedAction<unknown> = {type: 'searchCompleted', request: getRequestFixture(), response: getResponseFixture()};
      const staleState = getStaleStateFixture();
      const expectedState = staleState;
  
      expect(reducer(staleState, searchCompletedAction)).toEqual(expectedState);
    })
  
    it('remains unchanged when the search failed is not the last one started (prevents race condition)', async () => {
      const searchFailedAction: SearchFailedAction<unknown> = {type: 'searchFailed', request: getRequestFixture(), error: new Error()};
      const staleState = getStaleStateFixture();
      const expectedState = staleState;
  
      expect(reducer(staleState, searchFailedAction)).toEqual(expectedState);
    })
  
    it('to success state', async () => {
      const searchCompletedAction: SearchCompletedAction<unknown> = {type: 'searchCompleted', request: getRequestFixture(), response: getResponseFixture()};
      const staleState = getStaleStateFixture({
        newRequest: searchCompletedAction.request,
      });
      const expectedState = getSuccessStateFixture({
        request: searchCompletedAction.request,
        response: searchCompletedAction.response,
      });
  
      expect(reducer(staleState, searchCompletedAction)).toEqual(expectedState);
    })

    it('to error state', async () => {
      const searchFailedAction: SearchFailedAction<unknown> = {type: 'searchFailed', request: getRequestFixture(), error: new Error()};
      const staleState = getStaleStateFixture({
        newRequest: searchFailedAction.request,
      });
      const expectedState = getErrorStateFixture({
        request: searchFailedAction.request,
        error: searchFailedAction.error,
      });
  
      expect(reducer(staleState, searchFailedAction)).toEqual(expectedState);
    })
  });

  describe('From success state', () => {
    it('to stale state', async () => {
      const successState = getSuccessStateFixture();
      const searchStartedAction: SearchStartedAction<unknown> = {type: 'searchStarted', request: getRequestFixture(), abort: jest.fn()};
      const expectedState = getStaleStateFixture({
        request: successState.request,
        response: successState.response,
        newRequest: searchStartedAction.request,
        abort: searchStartedAction.abort,
      });
  
      expect(reducer(successState, searchStartedAction)).toEqual(expectedState);
    })
  });

  describe('From error state', () => {
    it('to loading state', async () => {
      const errorState = getErrorStateFixture();
      const searchStartedAction: SearchStartedAction<unknown> = {type: 'searchStarted', request: getRequestFixture(), abort: jest.fn()};
      const expectedState = getLoadingStateFixture({
        request: searchStartedAction.request,
        abort: searchStartedAction.abort,
      });
  
      expect(reducer(errorState, searchStartedAction)).toEqual(expectedState);
    })
  });

})
