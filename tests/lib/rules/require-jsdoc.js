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
const ACTION_PROP = "actions"

const OPTIONS = [
  {
    require: {
      VuexAction: true,
      VuexState: true,
    },
  },
]

const getVuexCore = (prop = "getters") => `${prop}: {},`

// Base test cases are cases that could be both valid and invalid
// depending on the comment before childProp
const createBaseCases = ({ comment }) => [
  {
    title: "store object returned by function",
    code: `function createStore() {
            return {
                ${getVuexCore()}
                ${ACTION_PROP}: {
                    ${comment}
                    initState() {}
                }
            };
        }`,
  },
  {
    title: "child prop is the state",
    code: `function createStore() {
            return {
                ${getVuexCore("actions")}
                state: {
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
            ${ACTION_PROP}: {
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
            ${ACTION_PROP}: {
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
            ${ACTION_PROP}: {
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
            ${ACTION_PROP}: awesomeName
        };`,
  },
  {
    title: "parent prop is es6 property shorthand syntax",
    options: OPTIONS,
    code: `
        const justVariableForSettingUpSomeScope = '';
        const ${ACTION_PROP} = {
            ${comment}
            initState: {}
        }
        
        const store = {
            ${getVuexCore()}
            ${ACTION_PROP}
        };`,
  },
  {
    title: "child property linked to identyfier",
    options: OPTIONS,
    code: `
        const varibaleName = function initState ()  {};
        const ${ACTION_PROP} = {
            ${comment}
            initState: varibaleName
        };
        
        const store = {
            ${getVuexCore()}
            ${ACTION_PROP}
        };`,
  },
  {
    title: "spread childs",
    options: OPTIONS,
    code: `
        const getProps = () => {};
        
        const store = {
            ${getVuexCore()}
            ${ACTION_PROP}: {
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
    
        const ${ACTION_PROP} = {
            ${comment}
            initState: function initState ()  {}
        };
        export default function createSsrStore() {
          return function nestedFunctions() {
            return {
              ${getVuexCore()}
              ${ACTION_PROP},
              mutations
            };
          }
        };`,
  },
  {
    title: "state is a function",
    options: OPTIONS,
    code: `
        function initialState() {
            return {
                ${comment}
                a: ''
            }
        }
        
        const store = {
            ${getVuexCore()}
            state: initialState,
            getters: {}
        }`,
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
      ${getVuexCore()}
      ${ACTION_PROP}: {}
    };`,
    options: OPTIONS,
  },
  {
    title: "parent prop default import",
    code: `
    import ${ACTION_PROP} from 'store';
    const store = {
      ${getVuexCore()}
      ${ACTION_PROP},
    };`,
    options: OPTIONS,
  },
  {
    title: "parent prop named import",
    code: `
    import { ${ACTION_PROP} } from 'store';
    const store = {
      ${getVuexCore()}
      ${ACTION_PROP},
    };`,
    options: OPTIONS,
  },
  {
    title: "Object has actions key, but it's not vuex store",
    code: `
    const store = {
      justSomeKey: 'asd',
      ${ACTION_PROP}: {
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
      ${ACTION_PROP}: "just string"
    };`,
    options: OPTIONS,
  },
]

const invalidCases = [
  ...baseInvalidCases,
  {
    title: "jsdoc is empty comment line",
    code: `const store = {
              ${getVuexCore()}
              ${ACTION_PROP}: {
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
              ${getVuexCore()}
              ${ACTION_PROP}: {
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

  {
    title: "state + actions",
    code: `function createStore() {
            return {
                ${getVuexCore("actions")}
                state: {
                    someValue: '',
                },
                ${ACTION_PROP}: {
                  initState() {}
              }
            };
        }`,
    errors: [
      {
        message: ERROR_MESSAGE,
      },
      {
        message: ERROR_MESSAGE,
      },
    ],
    options: OPTIONS,
  },
  {
    title: "Only state rule enabled",
    code: `function createStore() {
            return {
                ${getVuexCore("actions")}
                state: {
                    someValue: '',
                },
                ${ACTION_PROP}: {
                  initState() {}
              }
            };
        }`,
    errors: [
      {
        message: ERROR_MESSAGE,
      },
    ],
    options: [
      {
        require: {
          VuexAction: false,
          VuexState: true,
        },
      },
    ],
  },
]

const { valid, invalid } = prepareCases(validCases, invalidCases)

ruleTester.run("require-jsdoc", rule, {
  valid,
  invalid,
})
