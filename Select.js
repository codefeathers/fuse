'use strict';

class SelectValue {
	constructor(value, resolve) {
		this.value = value;
		if (resolve) this.resolve = resolve;
	}
}

SelectValue.prototype.resolve = () => null;

class SelectIterable {
	constructor(values, tests) {
		this.values = values
			.map(x => x instanceof SelectValue
				? x
				: new SelectValue(x)
			);
		this.tests = tests;
	}

	for(test, consequent) {
		const self = this;
		return new SelectIterable(
			self.values,
			[ ...self.tests, { test, consequent } ]
		);
	}
}

/* eslint-disable-next-line func-names */
SelectIterable.prototype.resolve = function (...args) {
	const self = this;
	return self.values.map(item => {
		const resolve = self
			.tests
			/* eslint-disable-next-line */
			.find(x => {
				return x.test(item.value)
					? x.consequent
					: null;
			});
		return resolve
			? resolve.consequent(...args, self.value)
			: () => null;
	});
};

class Select extends SelectValue {
	constructor(value, resolve) {
		super(value, resolve);
		this.iterable = typeof value === "object" && Symbol.iterator in value;
	}

	for(test, consequent) {
		if (this.iterable) {
			return new SelectIterable(
				Array.from(this.value),
				[ { test, consequent } ],
			);
		}
		if (test(this.value)) return new Select(this.value, consequent);
		return this;
	}
}

module.exports = Select;
