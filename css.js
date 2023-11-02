// MIT License
// Copyright (c) 2023 Pascal Brand

"use strict";

const fs = require( 'fs' );
const path = require('path')
const cssValidator = require('w3c-css-validator');
const parseCssUrls = require('css-url-parser');

async function w3cMarkupValidation(cssStr, filename, options) {
  let excludes = []
  if (options && options.excludes) {
    excludes = options.excludes
  } else {
    excludes = []
  }

  let results = await cssValidator.validateText(cssStr);
  results = results.errors
  excludes.forEach(e => results = results.filter((res) => !res[e.prop].includes(e.str)))
  let checkErrors = []
  results.forEach(err => checkErrors.push({
    filename: filename,
    line: err.line,
    message: err.message,
    tool: 'https://jigsaw.w3.org/css-validator//'
  }))

  return checkErrors
}

async function check(filename, options) {
  if (!options) {
    options = {}
  }

  const dirname = path.dirname(filename)
  const cssStr = fs.readFileSync(filename, 'utf8')

  const errors = w3cMarkupValidation(cssStr, filename, options.w3c)
  if (errors.length > 0) {
    return errors
  }

  const dependencies = parseCssUrls(cssStr)
  // console.log(`----------------- ${filename}`)
  // console.log(dependencies)
  let res = []
  for (const dep of dependencies) {
    try {
      const depname = (dirname + '/' + dep).replace(/\?.*/, '')
      const stat = await fs.promises.stat(depname);
      if (!stat.isFile()) {
        throw 'Not found'
      }
    } catch {
      res.push({
        filename: filename,
        // line: -1,
        message: `Dependency not found: ${dep}`,
        tool: 'css-url-parser'
      })
    }
  }
  return res     // TODO: check the dependencies area
  // https://github.com/dependents/node-detective-postcss
  // https://github.com/dependents/node-detective-scss

  // TODO: dependencies: internal and external
}

exports.check = check
