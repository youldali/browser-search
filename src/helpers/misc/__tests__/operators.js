import operators from '../operators';


describe('<', function(){
	test('it should return true when a < b', function(){
		const a = 10;
		const b = 20;
		expect(operators['<'](a, b)).toBe(true);
	});

	test('it should return false when a > b', function(){
		const a = 50;
		const b = 20;
		expect(operators['<'](a, b)).toBe(false);
	});
});

describe('>', function(){
	test('it should return true when a > b', function(){
		const a = 23;
		const b = 20;
		expect(operators['>'](a, b)).toBe(true);
	});

	test('it should return false when a < b', function(){
		const a = 10;
		const b = 20;
		expect(operators['>'](a, b)).toBe(false);
	});
});

describe('<=', function(){
	test('it should return true when a < b', function(){
		const a = 10;
		const b = 20;
		expect(operators['<='](a, b)).toBe(true);
	});

	test('it should return true when a == b', function(){
		const a = 20;
		const b = 20;
		expect(operators['<='](a, b)).toBe(true);
	});

	test('it should return false when a > b', function(){
		const a = 50;
		const b = 20;
		expect(operators['<='](a, b)).toBe(false);
	});
});

describe('>=', function(){
	test('it should return true when a > b', function(){
		const a = 15;
		const b = 14;
		expect(operators['>='](a, b)).toBe(true);
	});

	test('it should return true when a == b', function(){
		const a = 12;
		const b = 12;
		expect(operators['<='](a, b)).toBe(true);
	});

	test('it should return false when a < b', function(){
		const a = 18;
		const b = 20;
		expect(operators['>='](a, b)).toBe(false);
	});
});

describe('==', function(){
	test('it should return true when a == b (string)', function(){
		const a = 'test';
		const b = "test";
		expect(operators['=='](a, b)).toBe(true);
	});

	test('it should return true when a != b (string)', function(){
		const a = 'test1';
		const b = 'test2';
		expect(operators['=='](a, b)).toBe(false);
	});

	test('it should return true when a == b (number)', function(){
		const a = 10;
		const b = 10;
		expect(operators['=='](a, b)).toBe(true);
	});

	test('it should return true when a != b (number)', function(){
		const a = 12;
		const b = 14;
		expect(operators['=='](a, b)).toBe(false);
	});

	test('it should return true when a == b (mixed)', function(){
		const a = '1';
		const b = 1;
		expect(operators['=='](a, b)).toBe(true);
	});
});

describe('===', function(){
	test('it should return true when a === b', function(){
		const a = 'test';
		const b = "test";
		expect(operators['==='](a, b)).toBe(true);
	});

	test('it should return true when a !== b', function(){
		const a = 'test1';
		const b = 'test2';
		expect(operators['==='](a, b)).toBe(false);
	});

	test('it should return true when a === b (number)', function(){
		const a = 10;
		const b = 10;
		expect(operators['==='](a, b)).toBe(true);
	});

	test('it should return true when a !== b (number)', function(){
		const a = 12;
		const b = 14;
		expect(operators['==='](a, b)).toBe(false);
	});

	test('it should return false when a === b (mixed)', function(){
		const a = '1';
		const b = 1;
		expect(operators['==='](a, b)).toBe(false);
	});
});

describe('isIncluded', function(){
	test('it should return true when a is a subset of b (array)', function(){
		const a = 20;
		const b = [10, 20, 30];
		expect(operators['isIncluded'](a, b)).toBe(true);
	});

	test('it should return false when a is not a subset of b (string)', function(){
		const a = 20;
		const b = [10, 25, 30];
		expect(operators['isIncluded'](a, b)).toBe(false);
	});
});

describe('hasOneInCommon', function(){
	test('it should return true when a and b have a least one common element (1)', function(){
		const a = [1,2,3,4,5];
		const b = [3];
		expect(operators['hasOneInCommon'](a, b)).toBe(true);
	});

	test('it should return true when a and b have a least one common element (2)', function(){
		const a = [100, 200];
		const b = [1,2,3,4,5,6,7,100];
		expect(operators['hasOneInCommon'](a, b)).toBe(true);
	});

	test('it should return true when a and b have a least one common element (3)', function(){
		const a = ['car', 'plane'];
		const b = ['bike', 'boat', 'car', 'plane', 'town'];
		expect(operators['hasOneInCommon'](a, b)).toBe(true);
	});

	test('it should return false when a and b have a no common element', function(){
		const a = [100, 200, 300, 400, 500];
		const b = [1,2,3,4,5,6,7,8,9];
		expect(operators['hasOneInCommon'](a, b)).toBe(false);
	});
});


describe('contains', function(){
	test('it should return true when a (array) contains b', function(){
		const a = [10, 20, 30];
		const b = 20;
		expect(operators['contains'](a, b)).toBe(true);
	});

	test('it should return false when a (array) does not contain b', function(){
		const a = [10, 20, 30];
		const b = 21;
		expect(operators['contains'](a, b)).toBe(false);
	});
});
