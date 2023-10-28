"use strict";

const validator = require('html-validator')

async function htmlCheckSyntax(htmlStr) {
  const options = {
    //validator: 'WHATWG',    // local validati/on, without sending data to w3c - https://www.npmjs.com/package/html-validator#whatwg
    //format: 'text',
    data: htmlStr,
  }

  try {
    const results = await validator(options)
    console.log(typeof(results))
    console.log(results)
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

exports.htmlCheckSyntax = htmlCheckSyntax
