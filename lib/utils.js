const R = require("ramda")

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
 * Finds identifier defenition.
 * Using to resolve actual value of link.
 */
const getIdentifierDefenition = context => identifier => {
  const { name } = identifier.value
  const variable = findVariable(context.getScope(identifier.value), name)

  if (!variable) {
    throw new Error(`Cant find variable assigned to identifier: '${name}'`)
  }

  const defenition = R.last(variable.defs)

  if (!defenition) {
    throw new Error(`Cant find defenition of variable: '${variable.name}'`)
  }

  return defenition
}

/** TODO: docs */
const getIdentifierValue = context => identifier => {
  const { type, node } = getIdentifierDefenition(context)(identifier)

  if (type === "Variable") {
    return node.init // => Variable Value
  }

  if (type === "FunctionName") {
    return node // => FunctionDeclaration
  }

  // can't resolve Identifier value
  return null
}

// TODO: docs
const findReturnStatement = node => {
  if (!node.body) {
    return undefined
  }

  const returnStatement = R.find(
    ({ type }) => type === "ReturnStatement",
    node.body,
  )

  return returnStatement || findReturnStatement(node.body)
}

const filterUnsupportedProps = properties =>
  properties
    .filter(({ type }) => type !== "SpreadElement") // skip espree spread props for now
    .filter(({ type }) => type !== "ExperimentalSpreadProperty") // skip babel-eslint spread props for now

/** Return child properties of given node */
const getChildProperties = (node, context) => {
  if (node.value.type === "ObjectExpression") {
    return filterUnsupportedProps(node.value.properties)
  }

  if (node.value.type === "Identifier") {
    const value = getIdentifierValue(context)(node)

    if (!value) {
      return []
    }

    if (value.type === "FunctionDeclaration") {
      const returnStatement = findReturnStatement(value)
      return filterUnsupportedProps(returnStatement.argument.properties)
    }

    if (value.type === "ObjectExpression") {
      return filterUnsupportedProps(value.properties)
    }

    return []
  }

  return []
}

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

  const keys = property.parent.properties.map(R.path(["key", "name"]))

  const hasOnlyStateAndGetters = R.equals(
    keys.sort(),
    ["state", "getters"].sort(),
  )

  /**
   * Can't decide whether object is vuex store or it is action context
   * if it has only state and getters
   */
  if (hasOnlyStateAndGetters) {
    return false
  }

  const vaildKeysInsideProperties = R.innerJoin(
    (key, vaildKey) => key === vaildKey,
    keys,
    validKeys,
  )
  const hasOnlyValidKeys = R.all(key => validKeys.includes(key), keys)

  return R.length(vaildKeysInsideProperties) >= 2 && hasOnlyValidKeys
}

/**
 * Checks that given property is inside vue component object.
 * Assume that we are working with vue component, if it contain 2 or more valid vue keys
 */
const isWithinVueComponent = property => {
  const validKeys = [
    "props",
    "data",
    "components",
    "computed",
    "methods",
    "watch",
  ]
  const keys = property.parent.properties.map(R.path(["key", "name"]))
  const vaildKeysInsideProperties = R.innerJoin(
    (key, vaildKey) => key === vaildKey,
    keys,
    validKeys,
  )
  return R.length(vaildKeysInsideProperties) >= 2
}

const isVuexActions = node =>
  isWithinVuexStore(node) && node.key.name === "actions"

const isVuexGetters = node =>
  isWithinVuexStore(node) && node.key.name === "getters"

const isVuexState = node => isWithinVuexStore(node) && node.key.name === "state"

const isVueProps = node =>
  isWithinVueComponent(node) && node.key.name === "props"

module.exports = {
  getIdentifierDefenition,
  getIdentifierValue,
  getChildProperties,
  isVuexGetters,
  isVuexActions,
  isVuexState,
  isVueProps,
}
