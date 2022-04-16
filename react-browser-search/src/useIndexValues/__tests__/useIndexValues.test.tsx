import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { getRequestFixture, getResponseFixture, useIndexValuesStates } from '../../__fixtures__';
import {
    buildReducer, ErrorQueryState, IdleState, LoadingQueryState, RequestCompletedAction,
    RequestFailedAction, RequestStartedAction, StaleQueryState, SuccessQueryState,
} from '../useIndexValues';

const { getErrorStateFixture, getIdleStateFixture, getLoadingStateFixture, getStaleStateFixture, getSuccessStateFixture, getResponsePayloadFixture, getResquestPayloadFixture } = useIndexValuesStates;

describe ('reducer', () => {
  const reducer = buildReducer<string>();
  
  describe('From idle state', () => {
    it('To loading state', async () => {
      const idleState = getIdleStateFixture();
      const searchStartedAction: RequestStartedAction = {type: 'requestStarted', request: getResquestPayloadFixture()};
      const expectedState = getLoadingStateFixture({
        request: searchStartedAction.request,
      });
  
      expect(reducer(idleState, searchStartedAction)).toEqual(expectedState);
    })
  });

  describe('From loading state', () => {
    it('to next loading state', async () => {
      const searchStartedAction: RequestStartedAction= {type: 'requestStarted', request: getResquestPayloadFixture()};
      const loadingState = getLoadingStateFixture({
        request: getResquestPayloadFixture(),
      });
      const expectedState = getLoadingStateFixture({
        request: searchStartedAction.request,
      });
  
      expect(reducer(loadingState, searchStartedAction)).toEqual(expectedState);
    })

    it('remains unchanged when the search completed is not the last one started (prevents race condition)', async () => {
      const searchCompletedAction: RequestCompletedAction<string> = {type: 'requestCompleted', request: getResquestPayloadFixture(), response: getResponsePayloadFixture()};
      const loadingState = getLoadingStateFixture();
      const expectedState = loadingState;
  
      expect(reducer(loadingState, searchCompletedAction)).toEqual(expectedState);
    })
  
    it('remains unchanged when the search failed is not the last one started (prevents race condition)', async () => {
      const searchFailedAction: RequestFailedAction = {type: 'requestFailed', request: getResquestPayloadFixture(), error: new Error()};
      const loadingState = getLoadingStateFixture();
      const expectedState = loadingState;
  
      expect(reducer(loadingState, searchFailedAction)).toEqual(expectedState);
    })

    it('to success state', async () => {
      const searchCompletedAction: RequestCompletedAction<string> = {type: 'requestCompleted', request: getResquestPayloadFixture(), response: getResponsePayloadFixture()};
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
      const searchFailedAction: RequestFailedAction = {type: 'requestFailed', request: getResquestPayloadFixture(), error: new Error()};
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

    it('to next stale state', async () => {
      const searchStartedAction: RequestStartedAction = {type: 'requestStarted', request: getResquestPayloadFixture()};
      const staleState = getStaleStateFixture<string>({
        newRequest: getResquestPayloadFixture(),
        request: getResquestPayloadFixture(),
      });
      const expectedState = getStaleStateFixture<string>({
        request: staleState.request,
        newRequest: searchStartedAction.request,
      });
  
      expect(reducer(staleState, searchStartedAction)).toEqual(expectedState);
    })
  
    it('remains unchanged when the search completed is not the last one started (prevents race condition)', async () => {
      const searchCompletedAction: RequestCompletedAction<string> = {type: 'requestCompleted', request: getResquestPayloadFixture(), response: getResponsePayloadFixture()};
      const staleState = getStaleStateFixture<string>();
      const expectedState = staleState;
  
      expect(reducer(staleState, searchCompletedAction)).toEqual(expectedState);
    })
  
    it('remains unchanged when the search failed is not the last one started (prevents race condition)', async () => {
      const searchFailedAction: RequestFailedAction = {type: 'requestFailed', request: getResquestPayloadFixture(), error: new Error()};
      const staleState = getStaleStateFixture<string>();
      const expectedState = staleState;
  
      expect(reducer(staleState, searchFailedAction)).toEqual(expectedState);
    })
  
    it('to success state', async () => {
      const searchCompletedAction: RequestCompletedAction<string> = {type: 'requestCompleted', request: getResquestPayloadFixture(), response: getResponsePayloadFixture()};
      const staleState = getStaleStateFixture<string>({
        newRequest: searchCompletedAction.request,
      });
      const expectedState = getSuccessStateFixture<string>({
        request: searchCompletedAction.request,
        response: searchCompletedAction.response,
      });
  
      expect(reducer(staleState, searchCompletedAction)).toEqual(expectedState);
    })

    it('to error state', async () => {
      const searchFailedAction: RequestFailedAction = {type: 'requestFailed', request: getResquestPayloadFixture(), error: new Error()};
      const staleState = getStaleStateFixture<string>({
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
      const successState = getSuccessStateFixture<string>();
      const searchStartedAction: RequestStartedAction = {type: 'requestStarted', request: getResquestPayloadFixture(),};
      const expectedState = getStaleStateFixture<string>({
        request: successState.request,
        response: successState.response,
        newRequest: searchStartedAction.request,
      });
  
      expect(reducer(successState, searchStartedAction)).toEqual(expectedState);
    })
  });

  describe('From error state', () => {
    it('to loading state', async () => {
      const errorState = getErrorStateFixture();
      const searchStartedAction: RequestStartedAction = {type: 'requestStarted', request: getResquestPayloadFixture(),};
      const expectedState = getLoadingStateFixture({
        request: searchStartedAction.request,
      });
  
      expect(reducer(errorState, searchStartedAction)).toEqual(expectedState);
    })
  });

})
