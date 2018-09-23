# Disallow global commits and global dispatchs (no-root-store-calls)
Using commit or dispatch with the `{ root: true }` option might be harmful in a complex applications.
The rule disallow root store calls like this:
```js
actions: {
    myAction({ commit, dispath }) {
        commit('mutation', args, { root: true })
        dispatch({ type: 'anotherAction' }, { root: true })
    }
}
```

## Rule Details
Root store calls binds vuex module to a specific implementation of the root store. In order to reuse module elsewhere we have to re-create a specific set of root actions, mutations and a specific root state.
Disallowing root store calls leads to better modules isolation and more explicit dependencies in the code.

:thumbsdown: Examples of **incorrect** code for this rule

```js
// user module
login(ctx) {
  // ... logining
  // After a successful login we need to show welcome popup which is controlled by another module
  ctx.dispatch('welcomePopup/show', null, { root: true})   
}
```

```js
// container
methods: {
  ...mapActions('user', ['login']),
  handleClick() {
      // action call
      this.login();
  }
}
```

:thumbsup: Examples of **correct** code for this rule:

```diff
// user module
login(ctx) {
    // ... logining
-    ctx.dispatch('welcomePopup/show', null, { root: true})   
}
```

```diff
// container
methods: {
    ...mapActions('user', ['login']),
    ...mapActions('welcomePopup', ['show']),
    handleClick() {
        await this.login();
+        // instead of dispatching to welocmePopup from login action, call it explicitly in the container:
+        this.show()
    }
}
```

In some complex cases, you may need to watch state or getters and apply actions based on changed values.

## When Not To Use It
You might not need this rule if your vuex store is small.

## Further Reading

- [no-root-store-assets](./no-root-store-assets.md) - disallowing rootState and rootGetters serves the same purposes