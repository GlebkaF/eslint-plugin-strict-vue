/**
 * @fileoverview Every action in vuex store should preceded by jsdoc
 * @author glebkaf
 */

"use strict"

const R = require("ramda")

/**
 * Checks that given property is inside vuex store object.
 * Assume that we are working with vuex object, if it contain 2 or more valid vuex keys
 */
const isWithinVuexStore = property => {
  const validKeys = [
    "state",
    "actions",
    "mutations",
    "getters",
    "namespaced",
    "modules",
  ]
  const keys = property.parent.properties.map(prop => prop.key.name)
  const vaildKeysInsideProperties = R.innerJoin(
    (key, vaildKey) => key === vaildKey,
    keys,
    validKeys,
  )
  return R.length(vaildKeysInsideProperties) >= 2
}

/** Checks that given node has valid doc */
const hasLeadingComment = context => node => {
  const comments = context.getCommentsBefore(node) || []
  return comments.some(({ value = "" }) => value.trim())
}

/** Finds variable with given name */
function findVariable(scope, variableName) {
  if (!scope) {
    return undefined
  }
  const { variables, upper } = scope
  const variable = variables.find(({ name }) => variableName === name)

  return variable || findVariable(upper, variableName)
}

/**
 * Finds identifier value.
 * Using to resolve actual properties array of shorthand key
 */
const findIdentifierProperties = (identifierNode, context) => {
  const variable = findVariable(
    context.getScope(identifierNode.value),
    identifierNode.value.name,
  )

  if (!variable) {
    throw new Error(
      `Cant find shorthand variable '${identifierNode.value.name}'`,
    )
  }

  const isImportBinding = R.any(
    R.pathEq(["type"], "ImportBinding"),
    R.pathOr([], ["defs"], variable),
  )

  if (isImportBinding) {
    return []
  }

  const shorthandSource = variable.references
    .filter(i => i)
    .find(({ identifier }) => identifier.parent)

  if (!shorthandSource) {
    throw new Error(
      `Cant find shorthand source at file:${context.getFilename()}`,
    )
  }

  return shorthandSource.identifier.parent.init.properties
}

/** Return child properties of given node */
const getChildProperties = (node, context) => {
  if (node.value.type === "ObjectExpression") {
    return node.value.properties
  }

  if (node.value.type === "Identifier") {
    return findIdentifierProperties(node, context)
  }

  return []
}

const reportError = context => node => {
  if (!node.key) {
    throw new Error(`Node has no key: ${node}`)
  }

  context.report({
    node: node.key,
    message: "Missing JSDoc comment.",
  })
}

// TODO: docs
function checkActionsDoc(node, context) {
  try {
    if (node.key.name !== "actions") {
      return
    }

    if (!isWithinVuexStore(node)) {
      return
    }

    const actions = getChildProperties(node, context)
      .filter(({ type }) => type !== "SpreadElement") // skip espree spread props for now
      .filter(({ type }) => type !== "ExperimentalSpreadProperty") // skip babel-eslint spread props for now

    const filterValidActions = R.filter(
      R.complement(hasLeadingComment(context)),
    )
    const invalidActions = filterValidActions(actions)

    invalidActions.forEach(reportError(context))
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
    return {
      Property(node) {
        const DEFAULT_OPTIONS = {
          VuexAction: false,
          VuexState: false,
        }
        const options = Object.assign(
          DEFAULT_OPTIONS,
          (context.options[0] && context.options[0].require) || {},
        )

        if (options.VuexAction) {
          checkActionsDoc(node, context)
        }
      },
    }
  },
}
