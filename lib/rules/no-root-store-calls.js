const R = require("ramda")

// TODO: docs
const isRootCall = node => {
  const arg2 = R.path(["arguments", "1"], node)
  const arg3 = R.path(["arguments", "2"], node)

  const isRootArg = arg =>
    R.pathEq(["properties", "0", "key", "name"], "root", arg) &&
    R.pathEq(["properties", "0", "value", "value"], true, arg)

  return isRootArg(arg2) || isRootArg(arg3)
}

// TODO: docs
const checkRootCall = context => node => {
  if (isRootCall(node)) {
    context.report({
      node,
      message: "Don't dispatch/commit to root store.",
    })
  }
}

module.exports = {
  meta: {
    docs: {
      description: "Fill me in",
    },
    schema: [],
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
