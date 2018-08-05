# eslint-plugin-n1-vuex-plugin

Набор eslint правил для vuex сторов N1.RU
## Подключить в тест режиме куда-то:
```js
const config = require('@n1/eslint-config');
config.plugins.push('n1-vuex-plugin')
config.rules['n1-vuex-plugin/enforce-vuex-action-doc'] = 'error';
module.exports = config;
```

## Запуск отдельного правила
`npx eslint ./scripts/N1/Public/* --plugin n1-vuex-plugin --rule 'n1-vuex-plugin/enforce-vuex-action-doc: error' --no-eslintrc --parser babel-eslint`


## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-n1-vuex-plugin`:

```
$ npm install eslint-plugin-n1-vuex-plugin --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-n1-vuex-plugin` globally.

## Usage

Add `n1-vuex-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "n1-vuex-plugin"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "n1-vuex-plugin/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





