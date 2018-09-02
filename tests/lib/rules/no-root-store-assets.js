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
    const store = {
      state: {},
      namespaced: true,
      getters: {
        getter(state, getters, rootState, rootGetters) {
    
        },
        getter2(state, getters, rS, rG) {
    
        },
        getter2(state, getters, { asd }, { qwe }) {
    
        },
      },
    }
    `,
    errors: R.times(
      R.always({
        messageId: "avoidRootAssets",
      }),
      3,
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
]

const { valid, invalid } = prepareCases(validCases, invalidCases)

ruleTester.run("no-root-store-assets", rule, {
  valid,
  invalid,
})
