var fs = require('fs')
var path = require('path')
var findRoot = require('find-root')
var rootFolder = findRoot(process.env.PWD)


module.exports = function (package) {
  var result = getPackage(package);

  if (!result.version) {
    throw new Error('package.json has no `version` property')
  }

  if (!result.name) {
    throw new Error('package.json has no `name` property')
  }
  return result
}

function getPackage (package) {

  if (typeof package === 'string') {
    // see if it's JSON
    try {
      return JSON.parse(package)
    } catch (e) {
      // see if it's a filepath to the package file
      try {
        return JSON.parse(fs.readFileSync(path.resolve(package), 'utf-8'))
      } catch (e) {}
    }
  } else if (package == null) {
    // try to read it
    try {
      return JSON.parse(fs.readFileSync(path.join(rootFolder + '/package.json'), 'utf-8'))
    } catch (e) {
      throw new Error('Could not find package.json')
    }
  }

  // return the original in case
  // it was already an object.
  return package
}
