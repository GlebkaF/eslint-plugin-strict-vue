# eslint-plugin-strict-vue
<img src="https://pictr.com/images/2018/09/27/0Um6EQ.png" width="180" align="right">

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-strict-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-strict-vue)

Various ESLint rules to make you Vue(x) code a bit stricter

## 🥋 Requirements
* ESLint >=4.15.0
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
			"strict-vue/require-jsdoc": "error",
			"strict-vue/no-root-store-calls": "error",
			"strict-vue/no-root-store-assets": "error",
		}
	}
}
```


## 🎭 Rules

* [require-jsdoc](./docs/rules/require-jsdoc.md) - require JSdoc comments for Vue props, and Vuex actions and state.
* [no-root-store-calls](./docs/rules/no-root-store-calls.md) - disallow dispatch/commit to the global namespase.
* [no-root-store-assets](./docs/rules/no-root-store-assets.md) - disallow the use of rootGetters and rootStore.

## License
MIT



