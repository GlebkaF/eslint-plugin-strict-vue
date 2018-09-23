const R = require("ramda")
const { RuleTester } = require("eslint")
const rule = require("../../../lib/rules/no-root-store-assets")
const { prepareCases } = require("../../utils")

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
})

const ruleTester = new RuleTester()

const invalidCases = [
  {
    title: "Root state and getters used by getters",
    code: `
    const getter5 = function(state, getters, { a }, { b }) {};

    const store = {
        state: {},
        namespaced: true,
        getters: {
            getter1(state, getters, rootState, rootGetters) {},
            getter2(state, getters, rS, rG) {},
            getter3(state, getters, { asd }, { qwe }) {},
            getter4: (state, getters, rootState, rootGetters) => {},
            getter5,
        },
    };
    `,
    errors: R.times(
      R.always({
        messageId: "avoidRootAssets",
      }),
      5,
    ),
  },
  {
    title: "Deep linked getter",
    code: `
    const getter = function(state, getters, { a }, { b }) {};

    const getters = {
        getter,
    };
    
    const store = {
        state: {},
        namespaced: true,
        getters: {
            getter,
        },
    };
    
    `,
    errors: R.times(
      R.always({
        messageId: "avoidRootAssets",
      }),
      1,
    ),
  },
  {
    title: "Root state and getters used by actions",
    code: `
    const action6 = function (ctx) {
      console.log(ctx.rootState)
      console.log(ctx.rootGetters)
    };
    
    const store = {
      state: {},
      namespaced: true,
      actions: {
          action1({ rootState, rootGetters }) {},
          action2({ rootState: rs, rootGetters: rg }) {},
          action3: function({ rootState, rootGetters }) {},
          action4: (ctx) => {
            const { rootState, rootGetters } = ctx;
          },
          action5(ctx) {
            console.log(ctx.rootState);
            console.log(ctx.rootGetters);
          },
          action6,
      },
  };  
    `,
    errors: R.times(
      R.always({
        messageId: "avoidRootAssets",
      }),
      12,
    ),
  },
]

const validCases = [
  {
    title: "Getters like objects, but not getters",
    code: `
    const store = {
      state: {},
      thisIsNotGetters: {
        gettersLike(state, getters, rootState) {
    
        },
      },
    }
    `,
  },
  {
    title: "Valid use of context object",
    code: `
    const store = {
      state: {},
      namespaced: true,
      actions: {
          action({ commit, dispatch, state }) {},
          action2(ctx) {
              console.log(ctx.state);
              console.log(ctx.getters);
          },
      },
    };  
    `,
  },
]

const { valid, invalid } = prepareCases(validCases, invalidCases)

ruleTester.run("no-root-store-assets", rule, {
  valid,
  invalid,
})
