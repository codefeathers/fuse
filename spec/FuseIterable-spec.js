'use strict';

const { FuseIterable } = require('../index');

/* global describe it expect */
describe("FuseIterable", () => {

	it("Should return array " +
		"[ 'Is 10', 'Greater than 10', 'Lesser than 10', null ]",
	() => {
		const a = [ 10, 20, 0, 'UnexpectedString' ];

		const result = new FuseIterable(a)
			.on(x => x > 10, () => 'Greater than 10')
			.on(x => x < 10, () => 'Lesser than 10')
			.on(x => x === 10, () => `Is 10`);

		expect(result.resolve()).toEqual([
			'Is 10',
			'Greater than 10',
			'Lesser than 10',
			null
		]);
	});

	it("Should return array " +
		"[ 'Is 10', 'Greater than 10', 'Lesser than 10', null ]",
	() => {
		const a = [ 10, 20, 0, 'UnexpectedString' ];

		const result = new FuseIterable(a)
			.onField(
				[ x => x > 10, () => 'Greater than 10' ],
				[ x => x < 10, () => 'Lesser than 10' ],
				[ x => x === 10, () => `Is 10` ]);

		expect(result.resolve()).toEqual([
			'Is 10',
			'Greater than 10',
			'Lesser than 10',
			null
		]);
	});
});
