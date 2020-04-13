/* Create a connection to the test database.
 * Create a before each task, that removes all the documents from the 
 * users collection in the test database.
*/

// get the connection client
const { connectToDb, validator } = require("../database/database_connection");

let dbClient;
// before starting the tests, ensure that the connection to the
// database is running
before( done => {
	/* async function waitConnection() {
		const dbConnetion = await connectToDb;
		done();
	}
	waitConnection(); */
	connectToDb
		.then( client => {
			dbClient = client;
			done();
		})
		.catch( e => done(e) );
});

// before each test, drop the users collection
// then create the users collection with the validation data
beforeEach( done => {
	const db = dbClient.db("MongoDriverDataTest");
	db.dropCollection("users")
		.then( () => db.createCollection("users", validator) )
		.then( () => db.collection("users").createIndex({ location: "2dsphere" }) )
		.then( () => done() )
		.catch( e => {
			console.log( "error", e );
			done();
		});
	//
});
