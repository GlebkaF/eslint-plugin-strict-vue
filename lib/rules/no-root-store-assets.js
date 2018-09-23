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
  always,
} = require("ramda")
const {
  isVuexGetters,
  getChildProperties,
  getIdentifierValue,
} = require("../utils")

const reportError = (
  assetName = "rootState and rootGetters",
) => context => node => {
  context.report({
    node,
    messageId: "avoidRootAssets",
    data: {
      assetName,
    },
  })
}

/**
 * Check getters for using root assets: rootState or rootGetter, i.e.
 * check that arguments length >= 3
 */
const checkGettersForRootAssets = (node, context) => {
  try {
    const childProps = getChildProperties(node, context)

    const mapPropertyToFunction = cond([
      [pathEq(["value", "type"], "Identifier"), getIdentifierValue(context)],
      [T, path(["value"])],
    ])

    compose(
      forEach(
        cond([
          [
            pathSatisfies(gte(__, 4), ["params", "length"]),
            reportError("rootGetters")(context),
          ],
          [
            pathSatisfies(gte(__, 3), ["params", "length"]),
            reportError("rootState")(context),
          ],
          [T, always()],
        ]),
      ),
      map(mapPropertyToFunction),
    )(childProps)
  } catch (e) {
    console.error(`${e.message} \n at file: ${context.getFilename()}`)
  }
}

module.exports = {
  meta: {
    docs: {
      description: "Prevent from using rootState and rootGetters",
    },
    schema: [],
    messages: {
      avoidRootAssets: "Don't use {{ assetName }}",
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
      "Property[key.name='rootGetters']": reportError("rootGetters")(context),
      "Property[key.name='rootState']": reportError("rootState")(context),
      "MemberExpression[property.name='rootGetters']": reportError(
        "rootGetters",
      )(context),
      "MemberExpression[property.name='rootState']": reportError("rootState")(
        context,
      ),
    }
  },
}
