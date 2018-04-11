'use strict';

/**
 * FUSE
 * FunctionSelect: Return a function based on a condition.
 * @version 0.10.0
 * @author Muthu Kumar (MKRhere)
 */

/**
 * @callback predicate
 * @param {any} value The selected Fuse value
 * @returns {boolean} The Boolean result of the test
 */

/**
 * @callback consequent
 * @param {any} value The selected Fuse value
 * @param {...any} args An arbitrary array of arguments
 * @returns {any}
 */

/**
 * Creates a FuseItem instance with a value and optional resolve function.
 * FuseIterable constructor uses it internally, and Fuse extends FuseItem.
 * Not exposed.
 * @class FuseItem
 */
class FuseItem {
	/**
	 * @param {any} value The input value
	 * @param {function} resolve Optional resolve function
	 * @constructs FuseItem
	 */
	constructor(value, resolve) {
		this.value = value;
		if (resolve) {
			this.resolve = (...args) => resolve(this.value, ...args);
			this.resolved = true;
		}
	}

	/**
	 * Fallback resolve prototype. Returns null when called.
	 * Used in case a resolve is never found.
	 * @returns {null} null
	 * @memberof FuseItem
	 */
	resolve() {
		return null;
	}
}

/**
 * Creates a FuseIterable instance from an array or iterable.
 * @class FuseIterable
 * @param {iterable} values An iterable expression as the switch
 * @param {Array<function>} tests Array of { test, consequent } objects
 * @param {function} tests[].predicate Test function
 * @param {function} tests[].consequent Consequent function
 * @constructs FuseIterable
 */
class FuseIterable {
	constructor(values, conditionals) {
		this.values = Array.from(values).map(value =>
			value instanceof FuseItem
				? value
				: new FuseItem(value));
		this.conditionals = conditionals || [];
	}

	/**
	 * Accepts a test and consequent function each and returns a new
	 * FuseIterable instance.
	 * FuseIterable.prototype.for works a little differently than
	 * Fuse.prototype.for, by lazy accumulating the tests and
	 * resolving all the values when .resolve() is called.
	 * @param {callback} predicate A test callback function
	 * @param {callback} consequent Consequent callback function
	 * @returns {FuseIterable} An instance of FuseIterable
	 * @memberof FuseIterable
	 */
	on(predicate, consequent) {
		return new FuseIterable(this.values, [
			...this.conditionals,
			{ predicate, consequent }
		]);
	}

	/**
	 * Accepts a list of tuples as arguments and returns a new
	 * FuseIterable instance. An alternative to chaining multiple
	 * FuseIterable.prototype.on methods.
	 * @memberOf FuseIterable
	 * @param {...Array.<function>} tuples -
	 * Array of [ predicate, consequent ] pairs
	 * @returns {FuseIterable} An instance of FuseIterable
	 */
	onField(...tuples) {
		const conditionals = tuples.map(conditional =>
			({
				predicate: conditional[0],
				consequent: conditional[1]
			}));
		return new FuseIterable(this.values, conditionals);
	}

	/**
	 * Accepts parameters during resolve time and passes them along with
	 * each value into the winning consequent function.
	 * @param {...any} args Any number of arguments
	 * @returns {(any|null)} Resolved value or null if it was unresolved
	 */
	resolve(...args) {
		return this.values.map(item => {
			const resolver = this.conditionals.find(conditional =>
				conditional.predicate(item.value)
					? conditional.consequent
					: null
			);
			return resolver
				? resolver.consequent(item.value, ...args)
				: null;
		});
	}
}

/**
 * Creates a new Fuse instance.
 * @class Fuse
 * @extends {FuseItem}
 */
class Fuse extends FuseItem {

	/**
	 * Accepts a test and consequent function each and returns a new
	 * Fuse or FuseIterable instance.
	 * @param {callback} predicate A test callback function
	 * @param {callback} consequent Consequent callback function
	 * @returns {Fuse} Returns a new Fuse instance
	 * @memberof Fuse
	 */
	on(predicate, consequent) {

		/* If a resolve exists, just pass on the instance
			until .resolve() is called */
		if (this.resolved) return this;

		if (predicate(this.value)) return new Fuse(this.value, consequent);

		/* If the test doesn't pass, just pass the Fuse
			instance along the chain until a test passes,
			or .resolve() is called */
		return this;
	}

	/**
	 * Accepts a value instead of a test function, and checks for strict
	 * equality with this.value.
	 * @param {any} value Any value to check against this.value
	 * @param {function} consequent Consequent callback function
	 * @returns {Fuse} An instance of Fuse
	 */
	is(value, consequent) {
		return this.on(() => value === this.value, consequent);
	}


	/**
	 * Accepts a value instead of a test function, and checks for strict
	 * inequality with this.value.
	 * @param {any} value Any value to check against this.value
	 * @param {function} consequent Consequent callback function
	 * @returns {Fuse} An instance of Fuse
	 */
	not(value, consequent) {
		return this.on(() => value !== this.value, consequent);
	}
}

module.exports = Fuse;
module.exports.FuseIterable = FuseIterable;
