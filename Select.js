'use strict';

class SelectValue {
	constructor(value, resolve) {
		this.value = value;
		if (resolve) this.resolve = resolve;
	}

	resolve() {
		return null;
	}
}

// SelectValue.prototype.resolve = () => null;

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
		return new SelectIterable(
			this.values,
			[ ...this.tests, { test, consequent } ]
		);
	}

	resolve(...args) {
		return this.values.map(item => {
			const resolver = this
				.tests
				.find(x => x.test(item.value)
					? x.consequent
					: null);
			return resolver
				? resolver.consequent(...args, this.value)
				: null;
		});
	}
}

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
