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


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("enforce-vuex-action-doc", rule, {
    valid: [     
            `const store = {
                actions: {}
            };`,
            `const store = {
                actions: {
                    /**
                     * another jsdoc
                     */
                    initState() {}
                }
            };`,        
            `function createStore() {
                return {
                    actions: {
                        /**
                         * Regular jsdoc
                         */
                        initState() {}
                    }
                };
            }`        
    ],

    invalid: [
        {
            code: `const store = {
                actions: {
                    initState() {}
                }
            };`,
            errors: [{
                message: "Every method in vuex store should be preceed by jsdoc"
            }]
        },
        {
            code: `function createStore() {
                return {
                    actions: {
                        initState() {}
                    }
                };
            }`,
            errors: [{
                message: "Every method in vuex store should be preceed by jsdoc"
            }]
        },
    ]
});
