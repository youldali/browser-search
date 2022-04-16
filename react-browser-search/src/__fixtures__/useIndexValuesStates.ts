import {
    ErrorQueryState, IdleState, LoadingQueryState, RequestPayload, ResponsePayload, StaleQueryState,
    SuccessQueryState,
} from '../useIndexValues';

import { createFixture } from './createFixture';

const idleState: IdleState = {
  status: 'idle',
  isFetching: false,
}

const request: RequestPayload = {
  storeId: 'storeId',
  indexId: 'indexId',
}

const response: ResponsePayload<unknown> = [];

const loadingState: LoadingQueryState = {
  status: 'loading',
  isFetching: true,
  request: request,
}

const successState: SuccessQueryState<any> = {
  status: 'success',
  isFetching: false,
  request: request,
  response: response,
}

const staleState: StaleQueryState<any> = {
  status: 'stale',
  isFetching: true,
  request: request,
  response: response,
  newRequest: request,
}

const errorState: ErrorQueryState = {
  status: 'error',
  isFetching: false,
  request: request,
  error: new Error(),
}

export const getResquestPayloadFixture = (overrides?: Partial<RequestPayload>) => createFixture(request)(overrides);
export const getResponsePayloadFixture = <FieldValues = string>(overrides?: Partial<ResponsePayload<FieldValues>>) => createFixture(response as ResponsePayload<FieldValues>)(overrides);

export const getIdleStateFixture = () => createFixture(idleState)();
export const getLoadingStateFixture = (overrides?: Partial<LoadingQueryState>) => createFixture<LoadingQueryState>(loadingState)(overrides);
export const getSuccessStateFixture = <FieldValues = string>(overrides?: Partial<SuccessQueryState<FieldValues>>) => createFixture<SuccessQueryState<FieldValues>>(successState)(overrides);
export const getStaleStateFixture = <FieldValues = string>(overrides?: Partial<StaleQueryState<FieldValues>>) => createFixture<StaleQueryState<FieldValues>>(staleState)(overrides);
export const getErrorStateFixture = (overrides?: Partial<ErrorQueryState>) => createFixture<ErrorQueryState>(errorState)(overrides);
