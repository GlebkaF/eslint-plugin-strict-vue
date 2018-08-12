# eslint-plugin-strict-vue

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-strict-vue`:

```
$ npm install eslint-plugin-strict-vue --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-strict-vue` globally.

## Usage

Add `strict-vue` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "strict-vue"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "strict-vue/require-jsdoc": [
            "error",
            {
                require: {
                    VuexAction: true,
                    VuexState: false
                }
            }
        ]
    }
}
```

## Supported Rules

* `require-jsdoc` - Require JSdoc comments at Vue props, and Vuex actions and state.


## Run rule standalone
* `yarn add` or `yarn link` the package
* then run: `npx eslint . --plugin strict-vue --rule 'strict-vue/require-jsdoc: error' --no-eslintrc --parser babel-eslint`





