// MIT License
// Copyright (c) 2023 Pascal Brand

"use strict";

const fs = require('fs');
const path = require('path');
const html = require('./html.js');
const css = require('./css.js');

async function html5Check(dir, options) {
  if (!options) {
    options = {}
  }

  const files = await fs.promises.readdir(dir);

  // Loop them all with the new for...of
  for (const file of files) {
    // Get the full paths
    const filename = path.join(dir, file);

    // Stat the file to see if we have a file or dir
    const stat = await fs.promises.stat(filename);

    if (stat.isFile()) {
      // console.log("'%s' is a file.", filename);
      if (filename.endsWith('.html') || filename.endsWith('.htm')) {
        if (options && options.html && options.html.skip) {
          continue
        }
        const checkErrors = await html.check(filename, options.html)
        if (checkErrors.length !== 0) {
          return checkErrors
        }
      }
      if (filename.endsWith('.css')) {
        if (options && options.css && options.css.skip) {
          continue
        }

        const checkErrors = await css.check(filename, options.css)
        if (checkErrors.length !== 0) {
          return checkErrors
        }
      }
    } else if (stat.isDirectory()) {
      // console.log("'%s' is a directory.", filename);
      const checkErrors = await html5Check(filename, options)
      if (checkErrors.length !== 0) {
        return checkErrors
      }
    }
  } // End for...of

  return []    // no errors
}

exports.html5Check = html5Check
