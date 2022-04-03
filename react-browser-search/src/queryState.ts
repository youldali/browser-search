export interface IdleState {
  status: 'idle',
}

export interface LoadingQueryState<Request> {
  status: 'loading',
  request: Request;
}

export interface SuccessQueryState<Request, Response> {
  status: 'success',
  request: Request;
  response: Response;
}

export interface ErrorQueryState<Request, Error> {
  status: 'error',
  request?: Request;
  error: Error;
}

export type QueryState<Request, Response, Error> = IdleState | LoadingQueryState<Request> | SuccessQueryState<Request, Response> | ErrorQueryState<Request, Error>;
