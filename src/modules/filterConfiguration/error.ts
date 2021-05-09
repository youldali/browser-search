import { operators } from './operators'

type Errors = 'FilterConfig/Empty' | 'FilterConfig/EmptyGroup' | 'FilterConfig/InvalidOperator' | 'FilterConfig/InvalidFieldName' | 'FilterConfig/InvalidId'
| 'FilterConfig/MissingFieldName' | 'FilterConfig/MissingId' | 'FilterConfig/MissingOperator' | 'FilterConfig/DuplicateOperator';

export const errors: Record<Errors, string> = {
  'FilterConfig/Empty': 'Filter Config Error: The filter configuration cannot be empty',
  'FilterConfig/EmptyGroup': 'Filter Config Error: A group of filters cannot be empty',
  'FilterConfig/InvalidOperator': 'Filter Config Error: An operator is invalid. Valid operators are: ' + operators.toString(),
  'FilterConfig/InvalidFieldName': 'Filter Config Error: All field names must be alpha-numeric. They should match a key of the object stored',
  'FilterConfig/InvalidId': 'Filter Config Error: All Ids must be alpha-numeric. They should uniquely identify a filter',
  'FilterConfig/MissingFieldName': 'Filter Config Error: A field name is missing',
  'FilterConfig/MissingId': 'Filter Config Error: A filter Id is missing',
  'FilterConfig/MissingOperator': 'Filter Config Error: An operator is missing',
  'FilterConfig/DuplicateOperator': 'Filter Config Error: Ids of filters must be unique',
}
