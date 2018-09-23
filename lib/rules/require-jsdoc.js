"use strict"

const R = require("ramda")
const {
  getChildProperties,
  isVuexActions,
  isVuexState,
  isVueProps,
} = require("../utils")

const reportError = context => node => {
  if (!node.key) {
    throw new Error(`Node has no key: ${node}`)
  }

  context.report({
    node: node.key,
    message: "Missing JSDoc comment.",
  })
}

/** Checks that given node has no valid doc */
const hasNoValidDoc = context => node => {
  const comments = context.getCommentsBefore(node) || []
  const hasValidDoc = comments
    .filter(({ type }) => type === "Block")
    .map(({ value = "" }) => value.trim())
    .some(value => value.startsWith("*") && value.length > 1)
  return !hasValidDoc
}

/** Checks that all properties inside given property has valid doc */
const checkNestedPropertiesForDoc = (node, context) => {
  try {
    const childProps = getChildProperties(node, context)

    const filterPropsWithJsdoc = R.filter(hasNoValidDoc(context))
    const jsdoclessProps = filterPropsWithJsdoc(childProps)

    jsdoclessProps.forEach(reportError(context))
  } catch (e) {
    console.error(`${e.message} \n at file: ${context.getFilename()}`)
  }
}

module.exports = {
  meta: {
    docs: {
      description:
        "Require JSdoc comments at Vue props, and Vuex actions and state.",
      category: "Stylistic Issues",
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
      "ObjectExpression > Property": node => {
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
