/**
 * @fileoverview Every action in vuex store should preceded by jsdoc
 * @author glebkaf
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const ERROR_MESSAGE = 'Actions in vuex store should has jsdoc'
module.exports = {
    meta: {
        docs: {
            description: ERROR_MESSAGE,
            category: "Fill me in",
            recommended: false
        },
        fixable: null,  
        schema: []
    },

    create(context) {
        // Assume that we are working with vuex object
        // if the parent Object contain "state" propety
        const isWithinVuexStore = (node) => node.parent.properties.some(prop => prop.key.name === 'state');

        return {
            Property (node) {
                if(node.key.name !== 'actions') {
                    return;
                }

                if(!isWithinVuexStore(node)) {
                    return;
                }

                const hasLeadingComment = ({ leadingComments = [] }) => leadingComments.some(({ value = '' }) => value.trim());
                
                // TODO: docs
                const findShorthandValue = (shorthandNode, context) => {
                    const { variables = [] } = context.getScope(shorthandNode.key);
                    const variable = variables.find(({ name }) => shorthandNode.key.name === name)
                    const dummyValue = {properties: []};
                    if(!variable) {
                        console.error('Cant find shorthand variable at file:', context.getFilename())
                        return dummyValue;
                    }

                    const shorthandSource = variable.references.filter(i => i).find(({ identifier }) => identifier.parent);
                    
                    if(!shorthandSource) {
                        console.error('Cant find shorthand source at file:', context.getFilename());
                        return dummyValue;
                    }

                    return shorthandSource.identifier.parent.init;
                };

                const actions = node.shorthand ? findShorthandValue(node, context).properties : node.value.properties;

                const invalidActions = actions.filter(node => !hasLeadingComment(node));
                
                invalidActions.forEach(node => 
                    context.report({
                    node: node.key,
                    message: ERROR_MESSAGE
                }));
            }
        };
    }
};
