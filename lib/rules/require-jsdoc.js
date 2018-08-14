/**
 * @fileoverview Every action in vuex store should preceded by jsdoc
 * @author glebkaf
 */

"use strict"

const R = require("ramda")
const {
  checkNestedPropertiesForDoc,
  isVuexActions,
  isVuexState,
  isVueProps,
} = require("../utils")

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
              VueProps: {
                type: "boolean",
              },
              VuexActions: {
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
    const defaultOptions = {
      VueProps: true,
      VuexActions: false,
      VuexState: false,
    }

    const { VuexActions, VuexState, VueProps } = R.merge(
      defaultOptions,
      R.path(["options", 0, "require"], context),
    )

    return {
      Property(node) {
        if (isVuexActions(node) && VuexActions) {
          checkNestedPropertiesForDoc(node, context)
        }

        if (isVuexState(node) && VuexState) {
          checkNestedPropertiesForDoc(node, context)
        }

        if (isVueProps(node) && VueProps) {
          checkNestedPropertiesForDoc(node, context)
        }
      },
    }
  },
}
