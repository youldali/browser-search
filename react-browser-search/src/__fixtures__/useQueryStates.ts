import {
    ErrorQueryState, IdleState, LoadingQueryState, StaleQueryState, SuccessQueryState,
} from '../useQuery';

import { createFixture } from './createFixture';
import { getRequestFixture } from './request';
import { getResponseFixture } from './response';

const idleState: IdleState = {
  status: 'idle',
  isFetching: false,
}

const loadingState: LoadingQueryState<any> = {
  status: 'loading',
  isFetching: true,
  request: getRequestFixture(),
  abort: jest.fn(),
}

const successState: SuccessQueryState<any> = {
  status: 'success',
  isFetching: false,
  request: getRequestFixture(),
  response: getResponseFixture(),
}

const staleState: StaleQueryState<any> = {
  status: 'stale',
  isFetching: true,
  request: getRequestFixture(),
  response: getResponseFixture(),
  newRequest: getRequestFixture(),
  abort: jest.fn(),
}

const errorState: ErrorQueryState<any> = {
  status: 'error',
  isFetching: false,
  request: getRequestFixture(),
  error: new Error(),
}

export const getIdleStateFixture = () => createFixture(idleState)();
export const getLoadingStateFixture = <Document>(overrides?: Partial<LoadingQueryState<Document>>) => createFixture<LoadingQueryState<Document>>(loadingState)(overrides);
export const getSuccessStateFixture = <Document>(overrides?: Partial<SuccessQueryState<Document>>) => createFixture<SuccessQueryState<Document>>(successState)(overrides);
export const getStaleStateFixture = <Document>(overrides?: Partial<StaleQueryState<Document>>) => createFixture<StaleQueryState<Document>>(staleState)(overrides);
export const getErrorStateFixture = <Document>(overrides?: Partial<ErrorQueryState<Document>>) => createFixture<ErrorQueryState<Document>>(errorState)(overrides);
