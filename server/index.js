const express = require("express");
// get the routes
const routes = require("./routes/routes");
// get the database connection code
const dbConnection = require("./database/database_connection");

// connect to the database
dbConnection.connectToDb();

const app = express();

// json parser
app.use(express.json());

// apply routes
routes(app);

// error handling after applying the routes


// start the server
app.listen(3080, () => {
	console.log( "----------------------\nServer Listening on Port 3080\n----------------------" );
});
