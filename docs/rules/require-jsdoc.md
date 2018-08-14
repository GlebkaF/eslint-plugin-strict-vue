# Require JSdoc comments (require-jsdoc)
Props is a public api of the Vue component so it should be well documented. The same applies to Vuex state and actions.

In terms of this rule JSdoc - it's any not empty comment block which starts with `*`. The simplest JSdoc is: 
```js
/** I'm a JSdoc */
```
## Rule details

This rule requires JSDoc comments for specified nodes. Supported nodes:

* `"VueProps"` - each prop should has JSdoc
* `"VuexState"` - each action should has JSdoc
* `"VuexActions"` - each state property should has JSdoc

## Options

This rule has a single object option:

* `"require"` requires JSDoc comments for the specified nodes

Default option settings are:

```json
{
    "require-jsdoc": ["error", {
        "require": {
            "VueProps": true,
            "VuexState": false,
            "VuexActions": false
        }
    }]
}
```

### require

:thumbsdown: Examples of **incorrect** code for this rule with the `{ "require": { "VueProps": true, "VuexActions": true, "VuexState": true } }` option:


```js
const GREET_EMEMY = 'greet enemy action';

function getInitialState() {
    return {
        message: 'GREETINGS, TRAVELER',
        random: Math.random
    }
}

const actions = {
    initState() {},
    [GREET_EMEMY]() {}
}

export default  function getStore(di) {
    // ...
    return {
        state: getInitialState,
        getters: {},
        actions
    }
}
```

```js
export default {
    props: {
        title: {
            type: String,
            default: "Money income"
        },
        samples: {
            type: Array,
            required: true
        }
    },
    data() {
        return {}
    },
    // ...
}
```

:thumbsup: Examples of **correct** code for this rule:

```js
const GREET_EMEMY = 'greet enemy action';

function getInitialState() {
    return {
        /** Hunter's greet */
        message: 'GREETINGS, TRAVELER',
        /** another well documented property */
        random: Math.random
    }
}

const actions = {
    /** This action performs only on server side */
    initState() {},
    /** Greets enemy  */
    [GREET_EMEMY]() {}
}

export default  function getStore(di) {
    // ...
    return {
        state: getInitialState,
        getters: {},
        actions
    }
}
```

```js
export default {
    props: {
        /** Graph title */
        title: {
            type: String,
            default: "Money income"
        },
        /**
         * Graph data
         * @type {Array<{date: Date, money: numer}>} 
         */
        samples: {
            type: Array,
            required: true
        }
    },
    data() {
        return {}
    },
    // ...
}
```

## When not to use it

If you do not require JSdoc for your vue props, vuex state or actions
