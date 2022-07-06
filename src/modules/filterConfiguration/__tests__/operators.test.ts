import { operatorToFunction } from '../operators';

describe('<', function(){
	test('it should return true when a < b', function(){
		const a = 10;
		const b = 20;
		expect(operatorToFunction['lt'](a, b)).toBe(true);
	});

	test('it should return false when a > b', function(){
		const a = 50;
		const b = 20;
		expect(operatorToFunction['lt'](a, b)).toBe(false);
	});
});

describe('>', function(){
	test('it should return true when a > b', function(){
		const a = 23;
		const b = 20;
		expect(operatorToFunction['gt'](a, b)).toBe(true);
	});

	test('it should return false when a < b', function(){
		const a = 10;
		const b = 20;
		expect(operatorToFunction['gt'](a, b)).toBe(false);
	});
});

describe('<=', function(){
	test('it should return true when a < b', function(){
		const a = 10;
		const b = 20;
		expect(operatorToFunction['lte'](a, b)).toBe(true);
	});

	test('it should return true when a == b', function(){
		const a = 20;
		const b = 20;
		expect(operatorToFunction['lte'](a, b)).toBe(true);
	});

	test('it should return false when a > b', function(){
		const a = 50;
		const b = 20;
		expect(operatorToFunction['lte'](a, b)).toBe(false);
	});
});

describe('>=', function(){
	test('it should return true when a > b', function(){
		const a = 15;
		const b = 14;
		expect(operatorToFunction['gte'](a, b)).toBe(true);
	});

	test('it should return true when a == b', function(){
		const a = 12;
		const b = 12;
		expect(operatorToFunction['gte'](a, b)).toBe(true);
	});

	test('it should return false when a < b', function(){
		const a = 18;
		const b = 20;
		expect(operatorToFunction['gte'](a, b)).toBe(false);
	});
});

describe('===', function(){
	test('it should return true when a === b (string)', function(){
		const a = 'test';
		const b = "test";
		expect(operatorToFunction['equals'](a, b)).toBe(true);
	});

	test('it should return true when a != b (string)', function(){
		const a = 'test1';
		const b = 'test2';
		expect(operatorToFunction['equals'](a, b)).toBe(false);
	});

	test('it should return true when a === b (number)', function(){
		const a = 10;
		const b = 10;
		expect(operatorToFunction['equals'](a, b)).toBe(true);
	});

	test('it should return true when a === b (mixed)', function(){
		const a = '1';
		const b = 1;
		expect(operatorToFunction['equals'](a, b)).toBe(false);
	});
});

describe('contains', function(){
	test('it should return true when a (array) contains b', function(){
		const a = [10, 20, 30];
		const b = 20;
		expect(operatorToFunction['contains'](a, b)).toBe(true);
		expect(operatorToFunction['containsOptimized'](a, b)).toBe(true);
	});

	test('it should return false when a (array) does not contain b', function(){
		const a = [10, 20, 30];
		const b = 21;
		expect(operatorToFunction['contains'](a, b)).toBe(false);
		expect(operatorToFunction['containsOptimized'](a, b)).toBe(false);
	});
});
