import { validateFilterConfig } from '../filterSchema.validator';
import { FilterConfig } from '../filter.model';
import { Operators } from '../operators'
import {Right } from 'purify-ts/Either'

const filterConfig: FilterConfig = [
    [
        { price: { field: 'price', operator: Operators.lt, operand: 200} }
    ]
]

const wrongFilterConfig: any = [
    [
        { price: { field: 'price', operator: "gibberish", operand: 200} }
    ]
]

describe('validateFilterConfig', function(){
	test('it should return the filterConfig is the validation succeeds', function(){
		expect(validateFilterConfig(filterConfig)).toEqual(Right(filterConfig));
	});

    test('it should reject the filterConfig is the operator is invalid', function(){
		expect(validateFilterConfig(wrongFilterConfig)).toEqual(Right(filterConfig));
	});
});