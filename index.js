"use strict";

const fs = require( 'fs' );
const path = require( 'path' );
const validator = require('html-validator')

async function htmlCheckSyntaxStr(htmlStr, filename) {
  const options = {
    //validator: 'WHATWG',    // local validati/on, without sending data to w3c - https://www.npmjs.com/package/html-validator#whatwg
    //format: 'text',
    data: htmlStr,
  }

  const excludes = [
    { prop: 'type',    str: 'info', },
    { prop: 'message', str: ' is not a “aspect-ratio” value.', },
    { prop: 'message', str: 'The “frameborder” attribute on the “iframe” element is obsolete. Use CSS instead', },
    { prop: 'message', str: 'Element “img” is missing required attribute “src”.', },
    { prop: 'message', str: 'Element “source” is missing required attribute “srcset”.', },
    { prop: 'message', str: 'Element “div” not allowed as child of element “ul” in this context. (Suppressing further errors from this subtree.)', },
    { prop: 'message', str: 'Non-space characters found without seeing a doctype first. Expected “<!DOCTYPE html>”.', },
    { prop: 'message', str: 'Element “head” is missing a required instance of child element “title”.', },
  ]

  let results = await validator(options)
  results = results.messages
  excludes.forEach(e => results = results.filter((res) => !res[e.prop].includes(e.str)))
  return results.length
}

async function htmlCheckSyntaxFile(filename) {
  return htmlCheckSyntaxStr(fs.readFileSync(filename, 'utf8'), filename)
}

async function html5Check(dir) {
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
        const nbErrors = await htmlCheckSyntaxFile(filename)
        if (nbErrors !== 0) {
          return nbErrors
        }
      }
    } else if (stat.isDirectory()) {
      // console.log("'%s' is a directory.", filename);
      const nbErrors = await html5Check(filename)
      if (nbErrors !== 0) {
        return nbErrors
      }
    }
  } // End for...of

  return 0    // no errors
}

exports.htmlCheckSyntax = htmlCheckSyntaxStr
exports.html5Check = html5Check
