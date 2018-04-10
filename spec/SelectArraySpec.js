'use strict';

const Select = require('../Select');

/* global describe it expect */
describe("Select", () => {

	it("Should return array" +
		"[ 'Is 10', 'Greater than 10', 'Lesser than 10', null ]",
	() => {
		const a = [ 10, 20, 0, 'UnexpectedString' ];

		const result = new Select(a)
			.if(x => x > 10, () => 'Greater than 10')
			.if(x => x < 10, () => 'Lesser than 10')
			.if(x => x === 10, () => `Is 10`);
		console.log(result.resolve());
		expect(result.resolve()).toEqual([ 
			'Is 10',
			'Greater than 10',
			'Lesser than 10',
			null
		]);
	});
});
