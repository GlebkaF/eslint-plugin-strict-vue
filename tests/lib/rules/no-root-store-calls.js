const R = require("ramda")
const { RuleTester } = require("eslint")
const rule = require("../../../lib/rules/no-root-store-calls")
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
    title: "disapatch global action by calling ctx method",
    code: `
      export default function createSomeStore() {
        return {
          actions: {
            action(ctx) {
              ctx.commit({ type: 'a' }, { root: true })
              ctx.dispatch('b', null, { root: true })
              const { commit, dispatch } = ctx;
              commit('c', null, { root: true })
              dispatch({ type: 'd' }, { root: true })
            },
          },
        }
      }
    `,
    errors: R.times(
      R.always({
        message: "Don't dispatch/commit to root store.",
      }),
      4,
    ),
  },
  {
    title: "commit global mutation by calling destructured method",
    code: `
      export default function createSomeStore() {
        return {
          actions: {
            action({ commit, dispatch }) {
              commit('b', null, { root: true })
              dispatch({ type: 'a' }, { root: true })
            },
          },
        }
      }
    `,
    errors: R.times(
      R.always({
        message: "Don't dispatch/commit to root store.",
      }),
      2,
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
  {
    title: "commit local mutation by calling destructured method",
    code: `
      export default function createSomeStore() {
        return {
          actions: {
            action({ dispatch, commit }) {
              dispatch(1, null)
              commit({ type: 'm', prop: 1})
            },
          },
        }
      }
    `,
  },
]

const { valid, invalid } = prepareCases(validCases, invalidCases)

// ruleTester.run("no-root-store-calls", rule, {
//   valid,
//   invalid,
// })
