const R = require("ramda")

/** Checks that given node has no valid doc */
const hasNoValidDoc = context => node => {
  const comments = context.getCommentsBefore(node) || []
  const hasValidDoc = comments.some(({ value = "" }) => value.trim())
  return !hasValidDoc
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
    throw new Error(`Cant find shorthand source for variable: ${variable.name}`)
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

/** Checks that all properties inside given property has valid doc */
const checkNestedPropertiesForDoc = (node, context) => {
  try {
    const childProps = getChildProperties(node, context)
      .filter(({ type }) => type !== "SpreadElement") // skip espree spread props for now
      .filter(({ type }) => type !== "ExperimentalSpreadProperty") // skip babel-eslint spread props for now

    const filterPropsWithJsdoc = R.filter(hasNoValidDoc(context))
    const jsdoclessProps = filterPropsWithJsdoc(childProps)

    jsdoclessProps.forEach(reportError(context))
  } catch (e) {
    console.error(`${e.message} \n at file: ${context.getFilename()}`)
  }
}

/**
 * Checks that given property is inside vuex store object.
 * Assume that we are working with vuex object, if it contain 2 or more valid vuex keys
 */
const isWithinVuexStore = property => {
  if (property.parent.type !== "ObjectExpression") {
    return false
  }

  const validKeys = [
    "state",
    "actions",
    "mutations",
    "getters",
    "namespaced",
    "modules",
  ]
  const keys = property.parent.properties.map(R.path(["key", "name"]))
  const vaildKeysInsideProperties = R.innerJoin(
    (key, vaildKey) => key === vaildKey,
    keys,
    validKeys,
  )
  return R.length(vaildKeysInsideProperties) >= 2
}

module.exports = {
  checkNestedPropertiesForDoc,
  isWithinVuexStore,
}
