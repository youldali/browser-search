import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { getRequestFixture } from '../__fixtures__';
import { LoadingQueryState, SuccessQueryState, useQuery } from '../useQuery';
import { useMutateStore } from '../useMutateStore';
import { BrowserSearchProvider } from '../provider/__mocks__';

jest.mock('../queryClient');

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
