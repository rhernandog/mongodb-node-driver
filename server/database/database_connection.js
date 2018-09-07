/* THIS FILE HANDLES THE CONNECTION TO THE DATABASE */
const MongoClient = require("mongodb").MongoClient;
// mongo url
const mongoUrl = "mongodb://localhost:27017/MongoDriverData";

// create a single user
const createSingleUser = (client, db, user) => {
	db.collection("users").insertOne(user, (err, response) => {
		if (err) throw (err);
		console.log("==========\nnew user added!!!!");
		client.close();
	}); // insert one
};

// create collection and add validator
const createUserCollection = client => {
	const MongoDriverData = client.db("MongoDriverData");
	// create the collection and add validation
	MongoDriverData.createCollection( "users", {
		validator: {
			$jsonSchema: {
				bsonType: "object",
				required: ["name"],
				properties: {
					name: {
						bsonType: "string",
						description: "is required and must be a string"
					}
				}
			}
		}, // validator
		validationAction: "error"
	}, ( err ) => {
		if ( err ) throw(err);
		createSingleUser(client, MongoDriverData, { name: 2 });
	});
};

// connect to the database
const connectToDb = () => {
	MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
		if (err) throw(err);
		console.log("--------------------\nConnected to local databse!!\n--------------------");
		// console.log( client.db("MongoDriverData") );
		createUserCollection(client);
	});
	/* return new Promise((resolve, reject) => {
		MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
			if (err) reject({ error: err });
			console.log("--------------------\nConnected to local databse!!\n--------------------");
			// console.log( client.db("MongoDriverData") );
			createUserCollection(client);
			resolve(client);
		});
	}); */
};

module.exports = {
	connectToDb
};
