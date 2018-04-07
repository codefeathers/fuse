'use strict';

const Select = (value, resolve) => ({
	value,
	for: (test, fn) => {
		if (resolve) return {
			...Select(value, resolve),
			resolve
		};
		if (test) return Select(value, fn);
		return Select(value);
	},
	resolve: resolve ? resolve : () => undefined
});

module.exports = Select;
