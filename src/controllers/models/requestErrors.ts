export type RequestErrors = 'Request/InvalidStoreId' | 'Request/StoreDoesNotExist' | 
'Request/InvalidPerPage' | 'Request/InvalidPage' | 'Request/InvalidOrderDirection' |
'Request/InvalidFiltersApplied' | 'Request/InvalidOrderBy';

export const requestErrors: Record<RequestErrors, string> = {
  'Request/InvalidStoreId': 'Request Error: The store Id must be a string.',
  'Request/StoreDoesNotExist': 'Request Error: The store Id does not exist. You must create it first',
  'Request/InvalidPerPage': 'Request Error: The per page property must be a natural number',
  'Request/InvalidPage': 'Request Error: The page property must be a natural number',
  'Request/InvalidOrderDirection': 'Request Error: The order direction property must be either "ASC" | "DESC"',
  'Request/InvalidOrderBy': 'Request Error: The order by property must be a string matching an indexed property name of your object',
  'Request/InvalidFiltersApplied': 'Request Error: The filters applied must be an array of strings, matching the Ids of filters defined in your filter config',
}
