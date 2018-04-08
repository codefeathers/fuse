'use strict';

const Select = require('../Select');

/* global describe it expect */
describe("Select", () => {

	it("Should return 'Is 10'", () => {
		const a = 10;

		const result = new Select(a)
			.for(x => x > 10, () => 'Greater than 10')
			.for(x => x < 10, () => 'Lesser than 10')
			.for(x => x === 10, () => `Is 10`);

		expect(result.resolve()).toBe(`Is 10`);
	});

	it("Should return 'Less than 10'", () => {
		const a = 1;

		const result = new Select(a)
			.for(x => x > 10, () => 'Greater than 10')
			.for(x => x < 10, () => 'Lesser than 10')
			.for(x => x === 10, () => `Is 10`);

		expect(result.resolve()).toBe('Lesser than 10');
	});

	it("Should return 'Greater than 10'", () => {
		const a = 100;

		const result = new Select(a)
			.for(x => x > 10, () => 'Greater than 10')
			.for(x => x < 10, () => 'Lesser than 10')
			.for(x => x === 10, () => `Is 10`);

		expect(result.resolve()).toBe('Greater than 10');
	});
});
