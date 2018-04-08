'use strict';

const isIterable = val => typeof val === "object" && Symbol.iterator in val;

class Select {
	constructor(value, resolve) {
		this.value = value;
		this.iterable = isIterable(value);
		if (resolve) this.resolve = resolve;
	}

	for(test, consequent) {
		if (test(this.value)) return new Select(this.value, consequent);
		if (this.resolve) return this;
		return this;
	}
}

Select.prototype.resolve = () => null;

module.exports = Select;
