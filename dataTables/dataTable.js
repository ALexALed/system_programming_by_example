// in-memory
// Each row has one value for each column, and all the values in a column have the same type 

// http://www.data-forge-js.com/
// pandas for python

// One way to store a table is row-major order, in which the values in each row are stored together in memory.
// This is sometimes also called heterogeneous storage because each “unit” of storage can contain values of different types.
// We can implement this design in JavaScript using an array of objects, each of which has the same keys

// Another option is column-major or homogeneous order, in which all the values in a column are stored together. 
// In JavaScript, this could be implemented using an object whose members are all arrays of the same length.

import microtime from 'microtime'
import sizeof from 'object-sizeof'
import yaml from 'js-yaml'
import { buildCols, colFilter, colSelect } from './columnMajor.js'
import { buildRows, rowFilter, rowSelect } from './rowMajor.js'

const RANGE = 3

const memory = (func, ...params) => {
  const before = process.memoryUsage()
  const result = func(...params)
  const after = process.memoryUsage()
  const heap = after.heapUsed - before.heapUsed
  const size = sizeof(result)
  return [result, size, heap]
}

const time = (func, ...params) => {
  const before = microtime.now()
  func(...params)
  const after = microtime.now()
  return after - before
}

const calculateRatio = (f2S, rFilterT, rSelectT, cFilterT, cSelectT) => {
  return ((f2S * rFilterT) + rSelectT) / ((f2S * cFilterT) + cSelectT)
}

const main = () => {
  const nRows = parseInt(process.argv[2])
  const nCols = parseInt(process.argv[3])
  const filterPerSelect = parseFloat(process.argv[4])

  const labels = [...Array(nCols).keys()].map(i => `label_${i + 1}`)
  const someLabels = labels.slice(0, Math.floor(labels.length / 2))

  const [rowTable, rowSize, rowHeap] = memory(buildRows, nRows, labels)
  const [colTable, colSize, colHeap] = memory(buildCols, nRows, labels)

  const rowFilterTime =
    time(rowFilter, rowTable,
      row => ((row.label_1 % RANGE) === 0))
  const rowSelectTime =
    time(rowSelect, rowTable, someLabels)
  const colFilterTime =
    time(colFilter, colTable,
      (table, iR) => ((table.label_1[iR] % RANGE) === 0))
  const colSelectTime =
    time(colSelect, colTable, someLabels)

  const ratio = calculateRatio(filterPerSelect,
    rowFilterTime, rowSelectTime,
    colFilterTime, colSelectTime)

  const result = {
    nRows,
    nCols,
    filterPerSelect,
    rowSize,
    rowHeap,
    colSize,
    colHeap,
    rowFilterTime,
    rowSelectTime,
    colFilterTime,
    colSelectTime,
    ratio
  }
  console.log(yaml.dump(result))
}

main()