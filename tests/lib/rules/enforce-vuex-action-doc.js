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

/**
 * Specify `only: true` prop. for stanalone testcase run.
 * Specify `skip: true` prop. to skip testcase
 */
const validCases = [
  {
    code: `const store = {
      ${VUEX_STORE_CORE_PROPERTY},
      ${PROPERTY_NAME}: {}
    };`,
  },
  {
    code: `const store = {
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}: {
                  /**
                   * another jsdoc
                   */
                  initState() {}
              }
          };`,
  },
  {
    code: `function createStore() {
              return {
                  ${VUEX_STORE_CORE_PROPERTY},
                  ${PROPERTY_NAME}: {
                      /**
                       * Regular jsdoc
                       */
                      initState() {}
                  }
              };
          }`,
  },
  {
    title: "Valid key with arrow function",
    code: `const store = {                
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}: {
                  // some docs
                  initState: () => {}
              }
          };`,
  },
  {
    title: "Valid key with regular function",
    code: `const store = {
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}: {
                  /* Some docs */
                  initState: function initState ()  {}
              }
          };`,
  },
  {
    title: "es6 property shorthand syntax",
    code: `
          const ${PROPERTY_NAME} = {
              /* Some docs */
                  initState: function initState ()  {}
          }
          
          const store = {
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}
          };`,
  },
]

const invalidCases = [
  // Without comment at all
  {
    code: `const store = {
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}: {
                  initState() {}
              }
          };`,
    errors: [
      {
        message: ERROR_MESSAGE,
      },
    ],
  },
  {
    code: `const store = {
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}: {
                  initState: () => {}
              }
          };`,
    errors: [
      {
        message: ERROR_MESSAGE,
      },
    ],
  },
  {
    code: `const store = {
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}: {
                  initState: function initState() {}
              }
          };`,
    errors: [
      {
        message: ERROR_MESSAGE,
      },
    ],
  },
  // Empty comment Line
  {
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
  // Empty comment Block
  {
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
  // Store creator function w/o comment
  {
    code: `function createStore() {
              return {
                  ${VUEX_STORE_CORE_PROPERTY},
                  ${PROPERTY_NAME}: {
                      initState() {}
                  }
              };
          }`,
    errors: [
      {
        message: ERROR_MESSAGE,
      },
    ],
  },
  // es6 property shorthand syntax
  {
    code: `
          const justVariableForSettingUpSomeScope = '';
          const ${PROPERTY_NAME} = {
                  initState: function initState ()  {}
          }
          
          const store = {
              ${VUEX_STORE_CORE_PROPERTY},
              ${PROPERTY_NAME}
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
