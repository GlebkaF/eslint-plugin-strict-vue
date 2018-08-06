const { isEmpty, map, omit, filter, path, complement } = require("ramda")

/**
 * Prepare testcases by filtering using skip and only props.
 * @param {Array} valid - valid testcases, each test may contain skip or only property
 * @param {Array} invalid - valid testcases, each test may contain skip or only property
 * @return {{valid: Array, invalid: Array}}
 */
function prepareCases(valid = [], invalid) {
  const filterStandalone = filter(({ only = false }) => only)
  const filterSkiped = filter(({ skip = false }) => !skip)
  const omitProps = map(omit(["only", "skip", "title"]))

  const standaloneValidCases = filterStandalone(valid)
  const standaloneInvalidCases = filterStandalone(invalid)

  const prepareReturnValue = (v, i) => ({
    valid: omitProps(filterSkiped(v)),
    invalid: omitProps(filterSkiped(i)),
  })

  // there are no standalone testcases
  if (isEmpty(standaloneValidCases) && isEmpty(standaloneValidCases)) {
    return prepareReturnValue(valid, invalid)
  }

  return prepareReturnValue(standaloneValidCases, standaloneInvalidCases)
}

module.exports = {
  prepareCases,
}
