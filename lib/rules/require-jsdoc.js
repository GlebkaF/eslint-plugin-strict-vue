/**
 * @fileoverview Every action in vuex store should preceded by jsdoc
 * @author glebkaf
 */

"use strict"

const R = require("ramda")
const { checkNestedPropertiesForDoc, isWithinVuexStore } = require("../utils")

module.exports = {
  meta: {
    docs: {
      description:
        "Require JSdoc comments at Vue props, and Vuex actions and state.",
      category: "Stylistic Issues",
      recommended: false,
    },
    schema: [
      {
        type: "object",
        properties: {
          require: {
            type: "object",
            properties: {
              VuexAction: {
                type: "boolean",
              },
              VuexState: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const { VuexAction = true, VuexState = true } =
      R.path(["options", 0, "require"], context) || {}

    return {
      Property(node) {
        if (isWithinVuexStore(node)) {
          if (node.key.name === "actions" && VuexAction) {
            checkNestedPropertiesForDoc(node, context)
          }

          if (node.key.name === "state" && VuexState) {
            checkNestedPropertiesForDoc(node, context)
          }
        }
      },
    }
  },
}
