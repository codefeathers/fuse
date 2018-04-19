'use strict';

const Fuse = require('../index');

/* global describe it expect */
describe("Fuse", () => {

	it("Should return 'Is 10'", () => {
		const a = 10;

		const result = new Fuse(a)
			.on(x => x > 10, () => 'Greater than 10')
			.on(x => x < 10, () => 'Lesser than 10')
			.on(x => x === 10, () => 'Is 10');

		expect(result.resolve()).toBe('Is 10');
	});

	it("Should return 'Less than 10'", () => {
		const a = 1;

		const result = new Fuse(a)
			.on(x => x > 10, () => 'Greater than 10')
			.on(x => x < 10, () => 'Lesser than 10')
			.on(x => x === 10, () => `Is 10`);

		expect(result.resolve()).toBe('Lesser than 10');
	});

	it("Should return 'Greater than 10'", () => {
		const a = 100;

		const result = new Fuse(a)
			.on(x => x > 10, () => 'Greater than 10')
			.on(x => x < 10, () => 'Lesser than 10')
			.on(x => x === 10, () => `Is 10`);

		expect(result.resolve()).toBe('Greater than 10');
	});

	it(`Should return '"a" was an array'`, () => {
		const a = [ 1, 2 ];

		const result = new Fuse(a)
			.on(x => Array.isArray(x), () => `"a" was an array`);

		expect(result.resolve()).toBe(`"a" was an array`);
	});

	it(`Should return 'null'`, () => {
		const a = 1;

		const result = new Fuse(a)
			.on(Array.isArray, () => `"a" was an array`);

		expect(result.resolve()).toBe(null);
	});

	it(`Should return 'null'`, () => {
		const a = 'UnexpectedString';

		const result = new Fuse(a)
			.on(x => x > 10, () => 'Greater than 10')
			.on(x => x < 10, () => 'Lesser than 10')
			.on(x => x === 10, () => `Is 10`);

		expect(result.resolve()).toBe(null);
	});

	it(`Should return true`, () => {
		const a = 'ExpectedString';

		const result = new Fuse(a)
			.is('ExpectedString', () => true);

		expect(result.resolve()).toBe(true);
	});

	it(`Should return true`, () => {
		const a = 'ExpectedString';

		const result = new Fuse(a)
			.not('UnexpectedString', () => true);

		expect(result.resolve()).toBe(true);
	});

	it(`Should return 'default'`, () => {
		const a = 'UnexpectedString';

		const result = new Fuse(a)
			.is('ExpectedString', () => true)
			.else(() => 'default');

		expect(result.resolve()).toBe('default');
	});
});
