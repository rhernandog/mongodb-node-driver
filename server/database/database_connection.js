/* THIS FILE HANDLES THE CONNECTION TO THE DATABASE */
const MongoClient = require("mongodb").MongoClient;

const dbName = `MongoDriverData${ process.env.NODE_ENV === "test" ? "Test" : ""}`;

const validator = {
	"validator": {
		"$jsonSchema": {
			"bsonType": "object",
			"required": ["name", "email", "location"],
			"properties": {
				"name": {
					"bsonType": "string",
					"description": "must be a string and is required"
				},
				"email": {
					"bsonType": "string",
					"description": "must be a string and is required"
				},
				"location": {
					"bsonType": "object",
					"description": "must be an object with the type and a location array",
					"properties": {
						"type": {
							"bsonType": "string",
							"description": "must be a string and is required"
						},
						"location": {
							"bsonType": "array",
							"description": "this must be an array of points"
						}
					}
				}
			}
		}
	}
};

// mongo url, check the current environment before creating the 
// database url, in case we need to connect to the test database
const mongoUrl = `mongodb://localhost:27017/${dbName}`;

// connect to the database
const connectToDb = () => {
	return new Promise((resolve, reject) => {
		MongoClient.connect(
			mongoUrl,
			{ useNewUrlParser: true },
			(err, client) => {
				if (err) reject({ error: err });
				console.log("--------------------\nConnected to local databse!!\n--------------------");
				// createUserCollection(client);
				const db = client.db(dbName);
				// create collection
				db.createCollection("users", { "validator": validator }, (err, res) => {
					if ( err ) reject({ error: err });
					resolve(client);
				});
			}
		);
	});
};

module.exports = {
	connectToDb: connectToDb(),
	dbName,
	validator
};
