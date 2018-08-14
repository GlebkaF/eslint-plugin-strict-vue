# eslint-plugin-strict-vue

<img src="https://github.com/GlebkaF/eslint-plugin-vue/blob/master/face-04.png" width="180" align="right">

Various ESLint rules to make you Vue(x) code a bit stricter

## Installation

```
$ npm i eslint eslint-plugin-strict-vue --save-dev
```

## Usage

Configure it in `package.json`.

```json
{
	"name": "my-awesome-project",
	"eslintConfig": {
		"parserOptions": {
			"ecmaVersion": 2018,
			"sourceType": "module"
		},
		"plugins": [
			"strict-vue"
		],
		"rules": {
			"strict-vue/require-jsdoc": "error"
		}
	}
}
```


## Rules

* [require-jsdoc](docs/rules/require-jsdoc.md) - require JSdoc comments for Vue props, and Vuex actions and state.

## License
MIT



