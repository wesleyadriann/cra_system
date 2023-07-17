const fs = require('fs')
const path = require('path')

const paths = require('./paths')

const logger = (...log) => console.log(`[POST BUILD][${new Date().toISOString()}]`, ...log)

function readEntryPoints() {
    logger('reading manifest - start')
    const manifestFile = fs.readFileSync(path.resolve(paths.appBuild, 'asset-manifest.json'), 'utf8')
    const manifestJson = JSON.parse(manifestFile)

    const entrypointJs = manifestJson.files['main.js']
    const entrypointCss = manifestJson.files?.['main.css'] ?? false

    logger('entrypoint js -', entrypointJs)
    logger('entrypoint css -', entrypointCss)
    logger('reading manifest - end')
    return { entrypointJs, entrypointCss }
}

function writeMaps(entrypoint) {
    logger('writing maps - start')
    const mapsPath = path.resolve(paths.appBuild, 'maps', 'index.json')

    const mapsFile = fs.readFileSync(mapsPath, 'utf8')
    const mapsJson = JSON.parse(mapsFile)
    mapsJson.imports['cra-system-js'] = entrypoint
    fs.writeFileSync(mapsPath, JSON.stringify(mapsJson))
    logger('writing maps - end')
}

function writeCss(entrypoint) {
  logger('writing css - start')
  const cssPath = path.resolve(paths.appBuild, 'static', 'css', 'index.css')

  let cssContent = ''
  if(entrypoint) {
    const cssFile = fs.readFileSync(cssPath, 'utf8')

    cssContent = cssFile.replace('%CSS_PATH%', entrypoint)
  }

  fs.writeFileSync(cssPath, cssContent)

  logger('writing css - end')
}

function main() {
  logger('post build - start')
  const entrypoints = readEntryPoints(paths.appBuild)
  writeMaps(entrypoints.entrypointJs)
  writeCss(entrypoints.entrypointCss)
  logger('post build - end')
}

module.exports = main
