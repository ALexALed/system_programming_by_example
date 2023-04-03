export const buildRows = (nRows, labels) => {
  const result = []
  for (let iR = 0; iR < nRows; iR += 1) {
    const row = {}
    labels.forEach(label => {
      row[label] = iR
    })
    result.push(row)
  }
  return result
}

export const rowFilter = (table, func) => {
  return table.filter(row => func(row))
}

export const rowSelect = (table, toKeep) => {
  return table.map(row => {
    const newRow = {}
    toKeep.forEach(label => {
      newRow[label] = row[label]
    })
    return newRow
  })
}
