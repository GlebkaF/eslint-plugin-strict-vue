# CI: lint, test, publish

# rule: store properties order
# rule: enforce namespaced vuex modules
# rule: restrict rootGetters and rootState

# require-jsdoc
handle this cases:
```js
function getInitialState() {
    return {
        prop: 1
    }
}

const store = {
    state: getInitialState(), // Handle this function invocation
    getters: {}
}
```
```js
function getInitialState() {
    // Handle all return statements whitin getInitialState function
    if (Math.random > 0.5) {
        return {
            prop: 1
        }
    }
    
    return Math.random > 0.5 ? { prop: 2 } : { prop: 3 }
}

const store = {
    state: getInitialState(),
    getters: {}
}
```