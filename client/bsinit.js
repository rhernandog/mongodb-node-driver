"use strict";

var bSync = require("browser-sync");


bSync.init({
	port: 3010,
	server: {
		baseDir: ["client"]
	},
	index: "index.html",
	// index: "follow-test.html",
	files: ["client/index.js", "client/index.html"],

});