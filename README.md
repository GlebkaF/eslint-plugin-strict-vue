# eslint-plugin-strict-vue

<img src="https://raw.githubusercontent.com/GlebkaF/eslint-plugin-vue/master/strict-vue-face.png" width="180" align="right">

Various ESLint rules to make you Vue(x) code a bit stricter

## Installation

You'll first need to install [ESLint](http://eslint.org):

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


## Run rule standalone
* `yarn add` or `yarn link` the package
* then run: `npx eslint . --plugin strict-vue --rule 'strict-vue/require-jsdoc: error' --no-eslintrc --parser babel-eslint`





