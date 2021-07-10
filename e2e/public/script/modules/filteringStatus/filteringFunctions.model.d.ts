import { GroupId, FilterConfigData } from 'modules/filterConfiguration';
export declare type FilterFunction<T> = (target: T) => boolean;
export declare type FilterFunctionsCollections<T> = FilterFunction<T>[][];
export declare type GroupIdToFilterFunctions<T> = Record<GroupId, FilterFunction<T>[]>;
export declare type FilterFunctionsToGroupId<T> = Map<FilterFunction<T>[], GroupId>;
export interface FilteringFunctionsData<T> {
    getFilterFunctionsFromGroup: (group: GroupId) => FilterFunction<T>[];
    getGroupIdFromFilterFunctions: (filterFunctions: FilterFunction<T>[]) => string | undefined;
    getFilterFunctionsCollections: () => FilterFunctionsCollections<T>;
}
export declare const getFilteringFunctionsData: <T>(filterConfigData: FilterConfigData<T>) => FilteringFunctionsData<T>;
