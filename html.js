// MIT License
// Copyright (c) 2023 Pascal Brand

"use strict";

const fs = require( 'fs' );
const validator = require('html-validator')

async function w3cMarkupValidation(htmlStr, filename, options) {
  const validatorOptions = {
    //validator: 'WHATWG',    // local validati/on, without sending data to w3c - https://www.npmjs.com/package/html-validator#whatwg
    //format: 'text',
    data: htmlStr,
  }

  let excludes = []
  if (options && options.excludes) {
    excludes = options.excludes
  } else {
    excludes = []
  }

  let results = await validator(validatorOptions)
  results = results.messages
  excludes.forEach(e => results = results.filter((res) => !res[e.prop].includes(e.str)))
  let checkErrors = []
  results.forEach(err => checkErrors.push({
    filename: filename,
    line: (err.firstLine !== undefined) ? err.firstLine : err.lastLine,
    message: err.message,
    tool: 'https://validator.w3.org/'
  }))
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
