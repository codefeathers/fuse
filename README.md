# select-return

Return a function based on a condition. Functional alternative to switch-case.

## Usage

```JavaScript
const a = 100;

const result = new Select(a)
	.for(x => x>10,
		a => `${a} is greater than 10.`)
	.for(x => x<10,
		a => `${a} is lesser than 10.`)
	.for(x => x===10,
		a => `${a} is 10.`)

console.log(result.resolve()); // -> "100 is greater than 10."
```

## Docs

Docs exist in `/docs` directory. Will be served soon.

## Development

> If you find any mistakes in code/documentation, or if you feel something could be done better, do PR :)

> I appreciate it.

- Always write test spec for any code you add. Make sure they run as intended.
- Add/update JSDoc comments as needed.
- Use npm scripts for linting, debugging, building docs.

Place your test file as `testscript.js` in root.

The following npm scripts are available: `npm run lint`, `npm run debug`, `npm run docs`.

## Credits

[@Floofies](https://github.com/Floofies) was of huge help during development of this module.

Also, [@TRGWII](https://github.com/trgwii) was a source of inspiration and guidance.