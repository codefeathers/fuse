'use strict';

/**
 * Return a function based on a condition.
 * Functional alternative to switch-case.
 * @projectname Select-Return
 * @version 1.0.0
 * @author Muthu Kumar (@MKRhere)
 */

/**
 * Creates a SelectValue instance with a value and optional resolve function.
 * Created internally from SelectIterable constructor, and not exported.
 * @class SelectValue
 */
class SelectValue {
	/**
	 * @param {any} value - the input value
	 * @param {function} resolve - optional resolve function
	 * @constructs SelectIterable
	 */
	constructor(value, resolve) {
		this.value = value;
		if (resolve) this.resolve = (...args) => resolve(...args, value);
	}

	/**
	 * Default resolve prototype. Returns null when called.
	 * Used in case a resolve is never set.
	 * @returns {object} null
	 * @memberof SelectValue
	 */
	resolve() {
		return null;
	}
}

/**
 * Creates a SelectIterable instance from an array.
 * Created internally from Select.prototype.for, and not exported.
 * @class SelectIterable
 */
class SelectIterable {
	/**
	 * @param {array} values - array created from Select.prototype.for
	 * @param {Array<function>} tests - array of { test, consequent } objects
	 * @param {function} tests[].test - test function
	 * @param {function} tests[].consequent - consequent function
	 * @constructs SelectIterable
	 */
	constructor(values, tests) {
		this.values = values
			.map(x => x instanceof SelectValue
				? x
				: new SelectValue(x)
			);
		this.tests = tests;
	}

	/**
	 * Accepts a test and consequent function each and returns a new
	 * SelectIterable instance.
	 * @param {Test} test - test callback function
	 * @param {function} consequent - consequent callback function
	 * @returns {SelectIterable} - an instance of SelectIterable
	 * @memberof SelectIterable
	 */
	for(test, consequent) {
		/* SelectIterable.prototype.for works a little
			differently than Select.prototype.for,
			by accumulating the tests and resolving
			all the values when .resolve() is called */
		return new SelectIterable(
			this.values,
			[ ...this.tests, { test, consequent } ]
		);
	}

	resolve(...args) {
		/* When .resolve() is called, a resolved value
			is generated for each value in the array */
		return this.values.map(item => {
			const resolver = this
				.tests
				.find(x => x.test(item.value)
					? x.consequent
					: null);
			return resolver
				? resolver.consequent(...args, item.value)
				: null;
		});
	}
}

/**
 * Creates a new Select instance.
 * @class Select
 * @extends {SelectValue}
 */
class Select extends SelectValue {
	/**
	 * @param {any|array} value - the value or array of values to check against
	 * @param {function} resolve - optional resolve function
	 * @constructs Select
	 */
	constructor(value, resolve) {
		super(value, resolve);
		this.iterable = typeof value === "object" && Symbol.iterator in value;
	}

	/**
	 * Accepts a test and consequent function each and returns a new
	 * Select or SelectIterable instance.
	 * @param {function} test - test callback function
	 * @param {function} consequent - consequent callback function
	 * @returns {Select|SelectIterable} - Returns a SelectIterable instance
	 * if value was array, or a Select instance otherwise
	 * @memberof Select
	 */
	for(test, consequent) {
		if (this.iterable) {
			/* If the value passed to the constructor is
				an array, initialise a new SelectIterable
				with the array and { test, consequent } pair
				and return */
			return new SelectIterable(
				Array.from(this.value),
				[ { test, consequent } ],
			);
		}
		if (test(this.value)) return new Select(this.value, consequent);
		/* If the test doesn't pass, just pass the Select
			instance along the chain until a test passes,
			or .resolve() is called */
		return this;
	}
}

module.exports = Select;
