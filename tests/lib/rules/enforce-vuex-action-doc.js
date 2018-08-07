const R = require("ramda")
const { RuleTester } = require("eslint")
const rule = require("../../../lib/rules/enforce-vuex-action-doc")
const { prepareCases } = require("../../utils")

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
})

const ruleTester = new RuleTester()

const ERROR_MESSAGE = "Actions in vuex store should has jsdoc"
const PROPERTY_NAME = "actions"
const VUEX_STORE_CORE_PROPERTY = "state: {}"

// Base test cases are cases that could be both valid and invalid
// depending on the comment before childProp
const createBaseCases = ({ comment }) => [
  {
    title: "store object returned by function",
    code: `function createStore() {
            return {
                ${VUEX_STORE_CORE_PROPERTY},
                ${PROPERTY_NAME}: {
                    ${comment}
                    initState() {}
                }
            };
        }`,
  },
  {
    title: "child prop is es6 function shorthand",
    code: `const store = {
            ${VUEX_STORE_CORE_PROPERTY},
            ${PROPERTY_NAME}: {
                ${comment}
                initState() {}
            }
        };`,
  },
  {
    title: "child prop is an arrow function",
    code: `const store = {                
            ${VUEX_STORE_CORE_PROPERTY},
            ${PROPERTY_NAME}: {
                ${comment}
                initState: () => {}
            }
        };`,
  },
  {
    title: "child prop is a regular function",
    code: `const store = {
            ${VUEX_STORE_CORE_PROPERTY},
            ${PROPERTY_NAME}: {
                ${comment}
                initState: function initState ()  {}
            }
        };`,
  },
  {
    title: "es6 property shorthand syntax",
    code: `
        const ${PROPERTY_NAME} = {
            ${comment}
            initState: function initState ()  {}
        }
        
        const store = {
            ${VUEX_STORE_CORE_PROPERTY},
            ${PROPERTY_NAME}
        };`,
  },
  {
    title: "es6 property shorthand syntax + property export",
    code: `
        export const ${PROPERTY_NAME} = {
            ${comment}
            initState: function initState ()  {}
        }
        
        const store = {
            ${VUEX_STORE_CORE_PROPERTY},
            ${PROPERTY_NAME}
        };`,
  },
  {
    code: `
          const justVariableForSettingUpSomeScope = '';
          const ${PROPERTY_NAME} = {
                  ${comment}
                  initState: function initState ()  {}
          }
          
          const store = {
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}
          };`,
  },
]

const baseValidCases = createBaseCases({ comment: "/** Simple valid jsdoc */" })
const baseInvalidCases = createBaseCases({ comment: "" }).map(testCase => ({
  ...testCase,
  errors: [
    {
      message: ERROR_MESSAGE,
    },
  ],
}))

/**
 * Specify `only: true` prop. for stanalone testcase run.
 * Specify `skip: true` prop. to skip testcase
 */
const validCases = [
  ...baseValidCases,
  {
    title: "empty parent",
    code: `const store = {
      ${VUEX_STORE_CORE_PROPERTY},
      ${PROPERTY_NAME}: {}
    };`,
  },
]

const invalidCases = [
  ...baseInvalidCases,
  {
    title: "jsdoc is empty comment line",
    code: `const store = {
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}: {
                  // 
                  initState() {},
              }
          };`,
    errors: [
      {
        message: ERROR_MESSAGE,
      },
    ],
  },
  {
    title: "jsdoc is empty comment block",
    code: `const store = {
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}: {
                  /*        */
                  initState() {},
              }
          };`,
    errors: [
      {
        message: ERROR_MESSAGE,
      },
    ],
  },
]

const { valid, invalid } = prepareCases(validCases, invalidCases)

ruleTester.run("enforce-vuex-action-doc", rule, {
  valid,
  invalid,
})
