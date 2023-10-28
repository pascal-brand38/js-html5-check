const assert = require("assert").strict;
const html5check = require("../index.js");

describe("html5-check", () => {
  describe("html only", () => {
    it("Hello World", () => {
      console.log('PASCAL')
    })
  })
  describe("html only", () => {

    it("Basic", () => {
        console.log('PASCAL')

        html5check.htmlCheckSyntax("<h1>I <3 bad markup</h2>")
    })
  })

})
