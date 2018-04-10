'use strict';
/**
* Return a function based on a condition.
* Functional alternative to switch-case.
* @projectname Select-Return
* @version 1.0.0
* @author Muthu Kumar (MKRhere)
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
* @param {array} values - array created from Select.prototype.for
* @param {Array<function>} tests - array of { test, consequent } objects
* @param {function} tests[].test - test function
* @param {function} tests[].consequent - consequent function
* @constructs SelectIterable
*/
class SelectIterable {
	constructor(values, conditionals) {
		this.values = values.map(value => value instanceof SelectValue ? value : new SelectValue(value));
		this.conditionals = conditionals;
	}
	/**
	* Accepts a test and consequent function each and returns a new
	*  SelectIterable instance.
	* SelectIterable.prototype.for works a little differently than
	*  Select.prototype.for, by accumulating the tests and resolving all the
	*  values when .resolve() is called.
	* @param {callback} predicate  A test callback function.
	*	@callback predicate
	*	@param {any} value   The Selected value.
	*	@returns {boolean}   The Boolean result of the test.
	* @param {callback} consequent  consequent callback function
	*	@callback consequent
	*	@param {Array} args  An arbitrary Array of arguments.
	*	@param {any} value   The Selected value.
	*	@returns {any}
	* @returns {SelectIterable}  an instance of SelectIterable
	* @memberof SelectIterable
	*/
	if(predicate, consequent) {
		return new SelectIterable(this.values, [
			...this.conditionals,
			{predicate, consequent}
		]);
	}
	forField(...pairs) {
		var pair;
		var callback;
		var even;
		pairs.forEach((pair, index) => {
			even = index % 2 === 0;
			pair = this.conditionals[this.conditionals.length];
			if (pair.length === 2) {
				this.conditionals.push({});
			};
			callback = conditionals[loc];
			if (typeof callback === "object") {
				if (Array.isArray(callback)) {
					pair.predicate = callback[0];
					pair.consequent = callback[0];
				} else {
					Object.assign(pair, {
						predicate: callback.predicate,
						consequent: callback.consequent
					});
				}
				continue;
			}
			if (even) pair.predicate = callback;
			if (!even) pair.consequent = callback;
		}, this);
		return new SelectIterable(
			this.values, 
			[...this.conditionals, ...conditionals]
		);
	}
	subset(value, consequent) {
		return this.if(this.value.every(element => element in value))
	}
	superset(value, consequent) {
		return this.if(value.every(element => element in this.value));
	}
}
SelectIterable.prototype.resolve = function (...args) {
	return this.values.map(item => {
		const resolver = this.conditionals.find(conditional =>
			conditional.predicate(item.value)
				? conditional.consequent
				: null
		);
		return resolver
			? resolver.consequent(...args, this.value)
			: null;
	}, this);
};

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
	* @param {callback} predicate  A test callback function.
	*	@callback predicate
	*	@param {any} value   The Selected value.
	*	@returns {boolean}   The Boolean result of the test.
	* @param {callback} consequent  consequent callback function
	*	@callback consequent
	*	@param {Array} args  An arbitrary Array of arguments.
	*	@param {any} value   The Selected value.
	*	@returns {any}
	* @returns {(Select|SelectIterable)} - Returns a SelectIterable instance
	*  if value was array, or a Select instance otherwise
	* @memberof Select
	*/
	if(predicate, consequent) {
		if (this.iterable) {
			/* If the value passed to the constructor is an
			 iterable, return a new SelectIterable using the
			 iterable and { test, consequent } pair.*/
			return new SelectIterable(
				Array.from(this.value),
				[{ predicate, consequent }]
			);
		}
		if (predicate(this.value)) {
			return new Select(this.value, consequent);
		}
		/* If the test doesn't pass, just pass the Select
			instance along the chain until a test passes,
			or .resolve() is called */
		return this;
	}
	is(value, consequent) {
		return this.if(value === this.value, consequent);
	}
	isNot(value, consequent) {
		return this.if(value !== this.value, consequent)
	}
}

module.exports = Select;
