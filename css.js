// MIT License
// Copyright (c) 2023 Pascal Brand

"use strict";

const fs = require( 'fs' );
const cssValidator = require('w3c-css-validator');

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

  // results.forEach(err => checkErrors.push({
  //   filename: filename,
  //   line: (err.firstLine !== undefined) ? err.firstLine : err.lastLine,
  //   message: err.message,
  //   tool: 'https://validator.w3.org/'
  // }))
  // return checkErrors

  return checkErrors
}

async function check(filename, options) {
  if (!options) {
    options = {}
  }
  return w3cMarkupValidation(fs.readFileSync(filename, 'utf8'), filename, options.w3c)

  // TODO: dependencies: internal and external

  // TODO: JSON-LD: dependencies and types
}

exports.check = check
