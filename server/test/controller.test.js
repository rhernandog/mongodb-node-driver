const assert = require("chai").assert;
const request = require("supertest");
// the express instance
const app = require("../index");
const { connectToDb } = require("../database/database_connection");
const ObjectId = require("mongodb").ObjectID;

const testData = {
	name: "Homer Jay",
	email: "homerjay@simpsons.com",
	location: {
		type: "Point",
		coordinates: [-71.378080, -33.791379]
	}
};

describe("Controllers Test", () => {

	// create user
	it("Should add a new user to the collection", done => {
		let db;
		connectToDb
			.then( client => {
				db = client.db("MongoDriverDataTest");
				return db.collection("users").countDocuments();
			})
			.then( firstCount => {
				request(app)
					.post("/users")
					.send(testData)
					.end( (err, res) =>{
						db.collection("users").countDocuments()
							.then( newCount => {
								assert.strictEqual(newCount, firstCount + 1);
								assert.equal(res.body.newUser[0].name, testData.name);
								done();
							}); // new count
					});
				// request
			}); // promise then
		// 
	});

	// get all users
	it("Should get all the users in the collection", done => {
		let db;
		connectToDb
			.then(client => {
				db = client.db("MongoDriverDataTest");
				// add new user to the collection
				return db.collection("users").insertOne(testData);
			})
			.then( () => db.collection("users").find({}).toArray() )
			.then( users => {
				assert.strictEqual(users.length, 1);
				assert.equal(users[0].name, testData.name);
				done();
			})
			.catch( e => done(e) );
		// 
	});

	// update a user
	it("Should update an existing user in the collection", done => {
		let db;
		connectToDb
			// insert a user
			.then( client => {
				db = client.db("MongoDriverDataTest");
				// add new user to the collection
				return db.collection("users").insertOne(testData);
			})
			// find the user and update it
			.then( response => {
				// get the user and update it
				return db.collection("users").findOneAndUpdate(
					{ _id: ObjectId(response.insertedId) },
					{ $set: { email: "evilhomer@simpsons.com" } },
					{ returnOriginal: false }
				);
			})
			// make assertions with the updated user
			.then( response => {
				assert.equal(response.value.email, "evilhomer@simpsons.com");
				done();
			})
			.catch( e => done(e) );
		// 
	});

	// delete a user
	it("Should delete a single user from the collection", done => {
		let db;
		connectToDb
			// insert a user
			.then( client => {
				db = client.db("MongoDriverDataTest");
				// add new user to the collection
				return db.collection("users").insertOne(testData);
			})
			.then( result => {
				return db.collection("users").findOneAndDelete(
					{ _id: ObjectId(result.insertedId) }
				);
			})
			.then( response => db.collection("users").find({ _id: ObjectId(response.value._id) }).toArray() )
			.then( users => {
				assert.strictEqual(users.length, 0);
				done();
			})
			.catch( e => done(e) );
	});

	// find a user
	it("Should find a user near the given location", done => {
		const locationQuery = {
			location: {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [-71.377774, -33.790955]
					},
					$maxDistance: 5000
				}
			}
		};
		let db;
		connectToDb
			.then( client => {
				db = client.db("MongoDriverDataTest");
				// add new user to the collection
				return db.collection("users").insertOne(testData);
			})
			.then( () => db.collection("users").find(locationQuery).toArray() )
			.then( user => {
				assert.strictEqual(user.length, 1);
				assert.equal(user[0].name, testData.name);
				done();
			})
			.catch( e => done(e) );
	});

});