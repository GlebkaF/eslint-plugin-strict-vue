const R = require("ramda")

/** Checks that given node has no valid doc */
const hasNoValidDoc = context => node => {
  const comments = context.getCommentsBefore(node) || []
  const hasValidDoc = comments
    .filter(({ type }) => type === "Block")
    .map(({ value = "" }) => value.trim())
    .some(value => value.startsWith("*") && value.length > 1)
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
 * Finds identifier defenition.
 * Using to resolve actual value of link.
 */
const getIdentifierDefenition = (identifier, context) => {
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

/** Return child properties of given node */
const getChildProperties = (node, context) => {
  if (node.value.type === "ObjectExpression") {
    return node.value.properties
  }

  if (node.value.type === "Identifier") {
    const { type, node: defnode } = getIdentifierDefenition(node, context)

    if (type === "ImportBinding") {
      return []
    }

    if (type === "FunctionName") {
      const returnStatement = findReturnStatement(defnode)
      return returnStatement.argument.properties
    }

    if (type === "Variable") {
      return defnode.init.properties
    }
  }

  return []
}

const reportMissedJsdoc = context => node => {
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

    jsdoclessProps.forEach(reportMissedJsdoc(context))
  } catch (e) {
    console.error(`${e.message} \n at file: ${context.getFilename()}`)
  }
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

const isVuexState = node => isWithinVuexStore(node) && node.key.name === "state"

const isVueProps = node =>
  isWithinVueComponent(node) && node.key.name === "props"

module.exports = {
  checkNestedPropertiesForDoc,
  isVuexActions,
  isVuexState,
  isVueProps,
}
