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
      getters: {
        getter(state, getters, rootState, rootGetters) {
    
        },
        getter2: function (state, getters, rootState) {
    
        },
        getter3: (state, getters, rootState) => {
    
        },
      },
    }
    `,
    errors: R.times(
      R.always({
        message: "Don't use rootState and rootGetters",
      }),
      3,
    ),
  },
]

const validCases = [
  {
    title: "disapatch local action by calling ctx method",
    code: `
      export default function createSomeStore() {
        return {
          actions: {
            action(ctx) {
              ctx.commit('1')
            },
          },
        }
      }
    `,
  },
]

const { valid, invalid } = prepareCases(validCases, invalidCases)

ruleTester.run("no-root-store-assets", rule, {
  valid,
  invalid,
})
