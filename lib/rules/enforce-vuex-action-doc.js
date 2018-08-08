/**
 * @fileoverview Every action in vuex store should preceded by jsdoc
 * @author glebkaf
 */

"use strict"

const R = require("ramda")

const ERROR_MESSAGE = "Actions in vuex store should has jsdoc"

// Assume that we are working with vuex object
// if the parent Object contain "state" propety
const isWithinVuexStore = node =>
  node.parent.properties.some(prop => prop.key.name === "state")

// TODO: docs
const hasLeadingComment = context => node => {
  const comments = context.getCommentsBefore(node) || []
  return comments.some(({ value = "" }) => value.trim())
}

// TODO: docs
function findVariable(scope, variableName) {
  if (!scope) {
    return undefined
  }
  const { variables, upper } = scope
  const variable = variables.find(({ name }) => variableName === name)

  return variable || findVariable(upper, variableName)
}

// TODO: docs
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

// TODO: docs
const getChildProperties = (node, context) => {
  if (node.value.type === "ObjectExpression") {
    return node.value.properties
  }

  if (node.value.type === "Identifier") {
    return findIdentifierProperties(node, context)
  }

  return []
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

    invalidActions.forEach(action => {
      if (!action.key) {
        throw new Error(`Actions has no key: ${action}`)
      }

      context.report({
        node: action.key,
        message: ERROR_MESSAGE,
      })
    })
  } catch (e) {
    console.error(`${e.message} \n at file: ${context.getFilename()}`)
  }
}

module.exports = {
  meta: {
    docs: {
      description: ERROR_MESSAGE,
      category: "Fill me in",
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      Property(node) {
        checkActionsDoc(node, context)
      },
    }
  },
}
