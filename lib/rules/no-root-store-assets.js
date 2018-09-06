"use strict"

const {
  filter,
  compose,
  pathSatisfies,
  forEach,
  gte,
  map,
  pathEq,
  path,
  cond,
  T,
  __,
} = require("ramda")
const {
  isVuexGetters,
  getChildProperties,
  getIdentifierDefenition,
} = require("../utils")

const reportError = context => node => {
  context.report({
    node,
    messageId: "avoidRootAssets",
  })
}

const checkGettersForRootAssets = (node, context) => {
  const childProps = getChildProperties(node, context)

  const mapPropertyToFunction = cond([
    [
      pathEq(["value", "type"], "Identifier"),
      prop => {
        const { node: defnode } = getIdentifierDefenition(context)(prop)
        return defnode.init
      },
    ],
    [T, path(["value"])],
  ])

  compose(
    forEach(reportError(context)),
    filter(pathSatisfies(gte(__, 3), ["params", "length"])),
    map(mapPropertyToFunction),
  )(childProps)
}

module.exports = {
  meta: {
    docs: {
      description: "Prevent from using rootState and rootGetters",
      category: "Fill me in",
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
    messages: {
      avoidRootAssets: "Avoid using rootState and rootGetters",
    },
  },

  create(context) {
    return {
      // handle getters
      "ObjectExpression > Property": node => {
        if (isVuexGetters(node)) {
          checkGettersForRootAssets(node, context)
        }
      },
      // handle actions
      "Property[key.name='rootGetters']": reportError(context),
      "Property[key.name='rootState']": reportError(context),
      "MemberExpression[property.name='rootGetters']": reportError(context),
      "MemberExpression[property.name='rootState']": reportError(context),
    }
  },
}
