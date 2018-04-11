# Fuse
**FunctionSelect**

`Fuse` selects a function that passes a condition.

## Usage

### Fuse

```JavaScript
const Fuse = require('@codefeathers/fuse');

const a = 100;

const result = new Fuse(a)
	.on(x => x>10,
		a => `${a} is greater than 10.`)
	.on(x => x<10,
		a => `${a} is lesser than 10.`)
	.on(x => x===10,
		a => `${a} is 10.`)

console.log(result.resolve()); // -> "100 is greater than 10."
```

### FuseIterable

```JavaScript
const { FuseIterable } = require('@codefeathers/fuse');

const temperatures = [ 0, 20, 30 ];

const result = new FuseIterable(temperatures)
	.on(temp => temp<10,
		() => `Too cold!`)
	.on(temp => temp>=10 && temp <25,
		() => `Just right.`)
	.on(temp => temp>=25,
		() => `Too warm!`)

console.log(result.resolve()); // -> [ "Too cold!", "Just right.", "Too warm!" ]
```

## Docs

Docs exist in `/docs` directory. Will be served soon.

## Development

> If you find any mistakes in code/documentation, or if you feel something could be done better, do PR :)  I appreciate it.

- Always write test spec for any code you add. Make sure they run as intended.
- Add/update JSDoc comments as needed.
- Use npm scripts for linting, tests, debugging, building docs.

Place your test file as `testscript.js` in root.

The following npm scripts are available: `npm run lint`, `npm test`, `npm run debug`, `npm run docs`.

## Credits

[@Floofies](https://github.com/Floofies) was of huge help during development of this module.

Also, [@TRGWII](https://github.com/trgwii) was a source of inspiration and guidance.