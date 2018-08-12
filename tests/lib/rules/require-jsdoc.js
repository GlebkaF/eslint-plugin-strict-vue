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
const VUEX_STORE_CORE_PROPERTY = "state: {}"

// Base test cases are cases that could be both valid and invalid
// depending on the comment before childProp
const createBaseCases = ({ comment }) => [
  {
    title: "store object returned by function",
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
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
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
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
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
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
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
    code: `const store = {
            ${VUEX_STORE_CORE_PROPERTY},
            ${PROPERTY_NAME}: {
                ${comment}
                initState: function initState ()  {}
            }
        };`,
  },
  {
    title: "parent prop linked to object with different name",
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
    code: `
        const awesomeName = {
            ${comment}
            initState: {}
        }
        
        const store = {
            ${VUEX_STORE_CORE_PROPERTY},
            ${PROPERTY_NAME}: awesomeName
        };`,
  },
  {
    title: "parent prop is es6 property shorthand syntax",
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
    code: `
        const justVariableForSettingUpSomeScope = '';
        const ${PROPERTY_NAME} = {
            ${comment}
            initState: {}
        }
        
        const store = {
            ${VUEX_STORE_CORE_PROPERTY},
            ${PROPERTY_NAME}
        };`,
  },
  {
    title: "child property linked to identyfier",
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
    code: `
        const varibaleName = function initState ()  {};
        const ${PROPERTY_NAME} = {
            ${comment}
            initState: varibaleName
        };
        
        const store = {
            ${VUEX_STORE_CORE_PROPERTY},
            ${PROPERTY_NAME}
        };`,
  },
  {
    title: "spread childs",
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
    code: `
        const getProps = () => {};
        
        const store = {
            ${VUEX_STORE_CORE_PROPERTY},
            ${PROPERTY_NAME}: {
              ...getProps(),
              ${comment}
              initState() {},
            }
        };`,
  },
  {
    title: "deep nested store object",
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
    code: `
        export const mutations = {};
    
        const ${PROPERTY_NAME} = {
            ${comment}
            initState: function initState ()  {}
        };
        export default function createSsrStore() {
          return function nestedFunctions() {
            return {
              ${VUEX_STORE_CORE_PROPERTY},
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
      ${VUEX_STORE_CORE_PROPERTY},
      ${PROPERTY_NAME}: {}
    };`,
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
  },
  {
    title: "parent prop default import",
    code: `
    import ${PROPERTY_NAME} from 'store';
    const store = {
      ${VUEX_STORE_CORE_PROPERTY},
      ${PROPERTY_NAME},
    };`,
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
  },
  {
    title: "parent prop named import",
    code: `
    import { ${PROPERTY_NAME} } from 'store';
    const store = {
      ${VUEX_STORE_CORE_PROPERTY},
      ${PROPERTY_NAME},
    };`,
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
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
    options: [
      {
        require: {
          VuexAction: true,
        },
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
    options: [
      {
        require: {
          VuexAction: true,
        },
      },
    ],
  },
]

const { valid, invalid } = prepareCases(validCases, invalidCases)

ruleTester.run("enforce-vuex-action-doc", rule, {
  valid,
  invalid,
})
