const { RuleTester } = require("eslint")
const rule = require("../../../lib/rules/require-jsdoc")
const { prepareCases } = require("../../utils")

RuleTester.setDefaultConfig({
  // TODO: Add this options to readme
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
})

const ruleTester = new RuleTester()

const ERROR_MESSAGE = "Missing JSDoc comment."
const PROPERTY_NAME = "actions"
const OPTIONS = [
  {
    require: {
      VuexAction: true,
    },
  },
]

const getVuexCore = (prop = "state") => `${prop}: {},`

// Base test cases are cases that could be both valid and invalid
// depending on the comment before childProp
const createBaseCases = ({ comment }) => [
  {
    title: "store object returned by function",
    options: OPTIONS,
    code: `function createStore() {
            return {
                ${getVuexCore("state")}
                ${PROPERTY_NAME}: {
                    ${comment}
                    initState() {}
                }
            };
        }`,
  },
  {
    title: "child prop is es6 function shorthand",
    options: OPTIONS,
    code: `const store = {
            ${getVuexCore("getters")}
            ${PROPERTY_NAME}: {
                ${comment}
                initState() {}
            }
        };`,
  },
  {
    title: "child prop is an arrow function",
    options: OPTIONS,
    code: `const store = {                
            ${getVuexCore("mutations")}
            ${PROPERTY_NAME}: {
                ${comment}
                initState: () => {}
            }
        };`,
  },
  {
    title: "child prop is a regular function",
    options: OPTIONS,
    code: `const store = {
            ${getVuexCore("modules")}
            ${PROPERTY_NAME}: {
                ${comment}
                initState: function initState ()  {}
            }
        };`,
  },
  {
    title: "parent prop linked to object with different name",
    options: OPTIONS,
    code: `
        const awesomeName = {
            ${comment}
            initState: {}
        }
        
        const store = {
            namespaced: true,
            ${PROPERTY_NAME}: awesomeName
        };`,
  },
  {
    title: "parent prop is es6 property shorthand syntax",
    options: OPTIONS,
    code: `
        const justVariableForSettingUpSomeScope = '';
        const ${PROPERTY_NAME} = {
            ${comment}
            initState: {}
        }
        
        const store = {
            ${getVuexCore("state")}
            ${PROPERTY_NAME}
        };`,
  },
  {
    title: "child property linked to identyfier",
    options: OPTIONS,
    code: `
        const varibaleName = function initState ()  {};
        const ${PROPERTY_NAME} = {
            ${comment}
            initState: varibaleName
        };
        
        const store = {
            ${getVuexCore("state")}
            ${PROPERTY_NAME}
        };`,
  },
  {
    title: "spread childs",
    options: OPTIONS,
    code: `
        const getProps = () => {};
        
        const store = {
            ${getVuexCore("state")}
            ${PROPERTY_NAME}: {
              ...getProps(),
              ${comment}
              initState() {},
            }
        };`,
  },
  {
    title: "deep nested store object",
    options: OPTIONS,
    code: `
        export const mutations = {};
    
        const ${PROPERTY_NAME} = {
            ${comment}
            initState: function initState ()  {}
        };
        export default function createSsrStore() {
          return function nestedFunctions() {
            return {
              ${getVuexCore("state")}
              ${PROPERTY_NAME},
              mutations
            };
          }
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
      ${getVuexCore("state")}
      ${PROPERTY_NAME}: {}
    };`,
    options: OPTIONS,
  },
  {
    title: "parent prop default import",
    code: `
    import ${PROPERTY_NAME} from 'store';
    const store = {
      ${getVuexCore("state")}
      ${PROPERTY_NAME},
    };`,
    options: OPTIONS,
  },
  {
    title: "parent prop named import",
    code: `
    import { ${PROPERTY_NAME} } from 'store';
    const store = {
      ${getVuexCore("state")}
      ${PROPERTY_NAME},
    };`,
    options: OPTIONS,
  },
  {
    title: "Object has actions key, but it's not vuex store",
    code: `
    const store = {
      justSomeKey: 'asd',
      ${PROPERTY_NAME}: {
        someKey() {},
      }
    };`,
    options: OPTIONS,
  },
  {
    title: "Actions is not an Object",
    code: `
    const store = {
      ${getVuexCore("namespaced")}
      ${PROPERTY_NAME}: "just string"
    };`,
    options: OPTIONS,
  },
]

const invalidCases = [
  ...baseInvalidCases,
  {
    title: "jsdoc is empty comment line",
    code: `const store = {
              ${getVuexCore("state")}
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
    options: OPTIONS,
  },
  {
    title: "jsdoc is empty comment block",
    code: `const store = {
              ${getVuexCore("state")}
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
    options: OPTIONS,
  },
]

const { valid, invalid } = prepareCases(validCases, invalidCases)

ruleTester.run("enforce-vuex-action-doc", rule, {
  valid,
  invalid,
})
