import fs from 'fs-extra-promise'
import glob from 'glob-promise'
import crypto from 'crypto'

const statPath = async (path) => {
  const stat = await fs.statAsync(path)
  return [path, stat]
}

const readPath = async (path) => {
  const content = await fs.readFileAsync(path, 'utf-8')
  return [path, content]
}

const hashPath = (path, content) => {
  const hasher = crypto.createHash('sha1').setEncoding('hex')
  hasher.write(content)
  hasher.end()
  return [path, hasher.read()]
}

export const hashExisting = async (rootDir) => {
  const pattern = `${rootDir}/**/*`
  const options = {}
  const matches = await glob(pattern, options)
  const stats = await Promise.all(matches.map(path => statPath(path)))
  const files = stats.filter(([path, stat]) => stat.isFile())
  const contents = await Promise.all(
    files.map(([path, stat]) => readPath(path)))
  const hashes = contents.map(
    ([path, content]) => hashPath(path, content))
  return hashes
}

const root = process.argv[2]
hashExisting(root).then(pairs => pairs.forEach(
  ([path, hash]) => console.log(path, hash)
))
