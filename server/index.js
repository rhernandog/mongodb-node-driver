const express = require("express");
// get the cors - ONLY FOR DEVELOPMENT
const cors = require("cors");
// get the routes
const routes = require("./routes/routes");

const app = express();

// json parser
app.use(express.json());

// allow cors only in development
app.use( cors() );

// serve static files
app.use( express.static("client") );

// apply routes
routes(app);

// error handling after applying the routes


// start the server
app.listen(3080, () => {
	console.log( "----------------------\nServer Listening on Port 3080\n----------------------" );
});

module.exports = app;
