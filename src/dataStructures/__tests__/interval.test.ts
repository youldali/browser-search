import createInterval from '../interval';

describe('createInterval', () => {
	test('it should create an interval', () => {
		const interval = createInterval(5, 100)
		expect(interval[0]).toBe(5);
		expect(interval[1]).toBe(100);	
		expect(interval.toString()).toBe('[5,100]');	
	});
});