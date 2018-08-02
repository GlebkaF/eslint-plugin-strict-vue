/**
 * @fileoverview Every action in vuex store should preceded by jsdoc
 * @author glebkaf
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/enforce-vuex-action-doc"),

RuleTester = require("eslint").RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
      ecmaVersion: 6,
      sourceType: "module"
    }
  });


var ruleTester = new RuleTester();

const ERROR_MESSAGE = "Actions in vuex store should has jsdoc";
const PROPERTY_NAME = "actions";
const VUEX_STORE_CORE_PROPERTY = "state: {}";

ruleTester.run("enforce-vuex-action-doc", rule, {
    valid: [     
            `const store = {
                ${VUEX_STORE_CORE_PROPERTY},
                ${PROPERTY_NAME}: {}
            };`,
            `const store = {
                ${VUEX_STORE_CORE_PROPERTY},
                ${PROPERTY_NAME}: {
                    /**
                     * another jsdoc
                     */
                    initState() {}
                }
            };`,        
            `function createStore() {
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
            // Valid key with arrow function
            `const store = {                
                ${VUEX_STORE_CORE_PROPERTY},
                ${PROPERTY_NAME}: {
                    // some docs
                    initState: () => {}
                }
            };`,
            // Valid key with regular function
            `const store = {
                ${VUEX_STORE_CORE_PROPERTY},
                ${PROPERTY_NAME}: {
                    /* Some docs */
                    initState: function initState ()  {}
                }
            };`,
            // es6 property shorthand syntax
            `
            const ${PROPERTY_NAME} = {
                /* Some docs */
                    initState: function initState ()  {}
            }
            
            const store = {
                ${VUEX_STORE_CORE_PROPERTY},
                ${PROPERTY_NAME}
            };`,
    ],

    invalid: [
        // Without comment at all
        {
            code: `const store = {
                ${VUEX_STORE_CORE_PROPERTY},
                ${PROPERTY_NAME}: {
                    initState() {}
                }
            };`,
            errors: [{
                message: ERROR_MESSAGE
            }]
        },
        {
            code: `const store = {
                ${VUEX_STORE_CORE_PROPERTY},
                ${PROPERTY_NAME}: {
                    initState: () => {}
                }
            };`,
            errors: [{
                message: ERROR_MESSAGE
            }]
        },
        {
            code: `const store = {
                ${VUEX_STORE_CORE_PROPERTY},
                ${PROPERTY_NAME}: {
                    initState: function initState() {}
                }
            };`,
            errors: [{
                message: ERROR_MESSAGE
            }]
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
            errors: [{
                message: ERROR_MESSAGE
            }]
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
            errors: [{
                message: ERROR_MESSAGE
            }]
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
            errors: [{
                message: ERROR_MESSAGE
            }]
        },
        // es6 property shorthand syntax
        {
            code:`
            const justVariableForSettingUpSomeScope = '';
            const ${PROPERTY_NAME} = {
                    initState: function initState ()  {}
            }
            
            const store = {
                ${VUEX_STORE_CORE_PROPERTY},
                ${PROPERTY_NAME}
            };`,
            errors: [{
                message: ERROR_MESSAGE
            }]
        },
    ]
});
