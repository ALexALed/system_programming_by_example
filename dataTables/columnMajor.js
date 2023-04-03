export const buildCols = (nRows, labels) => {
  const result = {}
  labels.forEach(label => {
    result[label] = []
    for (let iR = 0; iR < nRows; iR += 1) {
      result[label].push(iR)
    }
  })
  return result
}

export const colFilter = (table, func) => {
  const result = {}
  const labels = Object.keys(table)
  labels.forEach(label => {
    result[label] = []
  })
  for (let iR = 0; iR < table.label_1.length; iR += 1) {
    if (func(table, iR)) {
      labels.forEach(label => {
        result[label].push(table[label][iR])
      })
    }
  }
  return result
}

export const colSelect = (table, toKeep) => {
  const result = {}
  toKeep.forEach(label => {
    result[label] = table[label]
  })
  return result
}