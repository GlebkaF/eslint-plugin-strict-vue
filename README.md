# eslint-plugin-strict-vue
<img src="https://github.com/GlebkaF/eslint-plugin-vue/blob/master/face-04.png" width="180" align="right">

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-strict-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-strict-vue)

Various ESLint rules to make you Vue(x) code a bit stricter

## 🥋 Requirements
* ESLint >=4.7.0
* Node.js >=8.0.0

## 🏋 Installation
```
$ npm i eslint eslint-plugin-strict-vue --save-dev
```

## 🤹‍ Usage

Configure it in `.eslintrc` or `package.json`:

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


## 🎭 Rules

* [require-jsdoc](docs/rules/require-jsdoc.md) - require JSdoc comments for Vue props, and Vuex actions and state.

## License
MIT



