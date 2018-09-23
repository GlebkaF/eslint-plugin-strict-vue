# Disallow rootGetters and rootState (no-root-store-assets)
Using rootGetters and rootStore might be harmful in a complex applications.
The rule disallows the use of rootGetters and rootStore.

## Rule Details
The use of rootStore and rootGetters binds vuex module to a specific implementation of the root store. In order to reuse module elsewhere we have to re-create a specific set of root getters and a specific root state.
Disallowing root store assets leads to better modules isolation and more explicit dependencies in the code.

### How to replace getters using rootState/rootGetters
Case:  button title depends on the user name

:thumbsdown: Examples of **incorrect** code for this rule
```js
actions:
// root store
state: {
   state: {
     userName: 'Glebka'
   }
}
```

```js
// AwesomeModule
getters: {
    linkTitle(state, getters, rootState) {
        return rootState.userName ? `Hail ${rootState.userName}!` : 'Hi man!'
    }
}
```

```js
// container
computed: {
   ...mapGetters('AwesomeModule', ['linkTitle'])
}
```

```diff
// template
span {{linkTitle}}
```

:thumbsup: Examples of **correct** code for this rule:

```js
actions:
// root store
state: {
   state: {
     userName: 'Glebka'
   }
}
```

```diff
// AwesomeModule
getters: {
    linkTitle(state, getters) {
        // Instead of using rootState return a function that explicitly depends on userName
-        return rootState.userName ? `Hail ${rootState.userName}!` : 'Hi man!'
+        return userName => userName ? `Hail ${userName}!` : 'Hi man!'
    }
}
```

```diff
// container
computed: {
   ...mapGetters('AwesomeModule', ['linkTitle']),
+   ...mapState(['userName']),
}
```

```diff
// template
- span {{linkTitle}
+ span {{linkTitle(userName)}}
```


### How to replace actions using rootState/rootGetters
Case: weather forecast module depends on the cityID.

:thumbsdown: Examples of **incorrect** code for this rule

```js
// weather module
actions: {
    fetchWeatherForecast({ rootGetters }) {
       const forecast = await weatherService.getForecast(rootGetters.cityID)
       // ...        
    }
}
```

```js
// container
methods: {
  ...mapActions('weather', ['fetchWeatherForecast']),
  mounted() {
      this.fetchWeatherForecast();
  }
}
```

:thumbsup: Examples of **correct** code for this rule:

```js
// weather module
actions: {
    // instead of using rootGetters explicitly pass cityID into the function
    fetchWeatherForecast(context, cityID) {
       const forecast = await weatherService.getForecast(cityID)
       // ...        
    }
}
```

```diff
// container
methods: {
  ...mapActions('weather', ['fetchWeatherForecast']),
+  ...mapGetters(['cityID']),
  mounted() {
-      this.fetchWeatherForecast();
+      this.fetchWeatherForecast(cityID);
  }
}
```

## When Not To Use It
You might not need this rule if your vuex store is small.

## Further Reading

- [no-root-store-calls](./no-root-store-calls.md) - disallowing dispatch/commit to the global namespase serves the same purposes