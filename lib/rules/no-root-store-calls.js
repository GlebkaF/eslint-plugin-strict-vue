const R = require("ramda")

/**
 * Checks whether commit or dispatch in the global namespace i.e.
 * check for { root: true } argument.
 */
const checkRootCall = context => node => {
  try {
    const arg2 = R.path(["arguments", "1"], node)
    const arg3 = R.path(["arguments", "2"], node)

    const isRootArg = arg =>
      R.pathEq(["properties", "0", "key", "name"], "root", arg) &&
      R.pathEq(["properties", "0", "value", "value"], true, arg)

    const isRootCall = isRootArg(arg2) || isRootArg(arg3)
    const actionName =
      R.path(["callee", "name"], node) ||
      R.path(["callee", "property", "name"], node)

    if (isRootCall) {
      context.report({
        node,
        messageId: "avoidRootCalls",
        data: {
          actionName,
        },
      })
    }
  } catch (e) {
    console.error(`${e.message} \n at file: ${context.getFilename()}`)
  }
}

module.exports = {
  meta: {
    docs: {
      description:
        "Prevent from dispatching actions or commiting mutations in the global namespace",
    },
    schema: [],
    messages: {
      avoidRootCalls: "Don't {{ actionName }} in the global namespace.",
    },
  },
  create(context) {
    return {
      "CallExpression[callee.name='commit']": checkRootCall(context),
      "CallExpression[callee.property.name='commit']": checkRootCall(context),
      "CallExpression[callee.name='dispatch']": checkRootCall(context),
      "CallExpression[callee.property.name='dispatch']": checkRootCall(context),
    }
  },
}
