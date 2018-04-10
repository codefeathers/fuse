'use strict';

/**
 * SelectValue - Wraps and pairs an arbitrary value with a reducer.
 * @class SelectValue
 * @param {any} value                An arbitrary value to store within.
 * @param {(Function|null)} resolve  The reducer.
 */
class SelectValue {
	constructor(value, resolve = null) {
		this.value = value;
		if (resolve !== null) this.resolve = resolve;
	}
}

SelectValue.prototype.resolve = () => null;

class SelectIterable {
	constructor(values, conditionals) {
		this.values = values.map(value => value instanceof SelectValue ? value : new SelectValue(value));
		this.conditionals = conditionals;
	}
	for(predicate, consequent) {
		return new SelectIterable(this.values, [...this.conditionals, { predicate, consequent }]);
	}
	forField(...pairs) {
		var pair;
		var callback;
		var even;
		for (
			// beforeBegin:
			var loc = 0;
			// beforeEvery:
			even = loc % 2 === 0,
			// breakPredicate:
			loc < pairs.length;
			// afterEvery:
			loc++
		) {
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
		}
		return new SelectIterable(this.values, [...this.conditionals, ...conditionals]);
	}
	subsetOf(value, consequent) {
		return this.for(this.value.every(element => element in this.value))
	}
}

/* eslint-disable-next-line func-names */
SelectIterable.prototype.resolve = function (...args) {
	return this.values.map(item => {
		const resolve = this.conditionals.find(tuple => tuple.predicate(item.value) ? tuple.consequent : null);
		return resolve ? resolve.consequent(...args, this.value) : () => null;
	}, this);
};

class Select extends SelectValue {
	constructor(value, resolve) {
		super(value, resolve);
		this.iterable = typeof value === "object" && Symbol.iterator in value;
	}
	for(predicate, consequent) {
		if (this.iterable) {
			return new SelectIterable(Array.from(this.value), [{ predicate, consequent }]);
		}
		if (predicate(this.value)) return new Select(this.value, consequent);
		return this;
	}
	is(value, consequent) {
		return this.for(value === this.value, consequent);
	}
}

module.exports = Select;
