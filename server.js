// Initial Module to Load
var initModule = "main";

// Dojo Configuration
dojoConfig = {
  async: true,
  baseUrl: "lib/",
  packages: [{
    name: "dojo",
    location: "dojo"
  },{
    name: "dijit",
    location: "dijit"
  },{
    name: "dojox",
    location: "dojox"
  }],
  deps: [initModule]
};

// Load dojo/dojo
require("./lib/dojo/dojo.js");