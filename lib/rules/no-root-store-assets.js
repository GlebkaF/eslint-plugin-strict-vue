"use strict"

const { filter, compose, pathSatisfies, forEach, lte } = require("ramda")
const { isVuexGetters, getChildProperties } = require("../utils")

const reportError = context => node => {
  context.report({
    node,
    messageId: "avoidRootAssets",
  })
}

const checkGettersForRootAssets = (node, context) => {
  const childProps = getChildProperties(node, context)

  compose(
    forEach(reportError(context)),
    filter(pathSatisfies(lte(3), ["value", "params", "length"])),
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
