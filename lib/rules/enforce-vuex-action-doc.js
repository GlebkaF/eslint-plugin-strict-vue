/**
 * @fileoverview Every action in vuex store should preceded by jsdoc
 * @author glebkaf
 */
"use strict";
const R = require('ramda');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Every action in vuex store should preceded by jsdoc",
            category: "Fill me in",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create(context) {
        // variables should be defined here
        const ERROR_MESSAGE = 'Every method in vuex store should be preceed by jsdoc'
        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

       
        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            Property (node) {
                if(node.key.name !== 'actions') {
                    return;
                }
                const isJsdoc = ({ value, type }) => R.and(R.startsWith('*\n', value), R.equals(type, 'Block'))

                const hasLeadingJsdoc = R.compose(
                    R.complement(R.isEmpty),
                    R.filter(isJsdoc),
                    R.pathOr([], ['leadingComments']),
                )

                const invalidNodes = R.filter(R.complement(hasLeadingJsdoc), node.value.properties);
                
                if(!R.isEmpty(invalidNodes)) {
                    R.forEach(node => {
                        context.report({
                            node,
                            message: ERROR_MESSAGE
                        })
                    }, invalidNodes)
                }
            }
        };
    }
};
