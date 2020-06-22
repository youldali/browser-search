//@flow
import type { Dispatch, ThunkAction } from 'modules/actions/types';
type asyncFunction = (...params: any) => Promise<any>;

export
const handleErrorAsync = (errorHandler: asyncFunction) => (ayncFunction: asyncFunction) => (...params: any): Promise<any> => {
    return ayncFunction(...params).catch(errorHandler);
};

export
const handleErrorThunkAction = (errorHandler: Function) => (ayncFunction: Function) => (...params: any) => (dispatch: Dispatch) : Promise<any>  => {
    return ayncFunction(...params)(dispatch).catch(errorHandler(dispatch));
};