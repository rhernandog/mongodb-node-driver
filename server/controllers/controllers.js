const { connectToDb, dbName } = require("../database/database_connection");
const ObjectId = require("mongodb").ObjectID;

/** Method to create the update object
 * @param {object} updates the updates object
 * @return {object} the updates object to pass in the query
 * @private
*/
const createUpdateObject = updates => {
	const newValues = {};
	// loop through the updates
	for( let prop in updates ) {
		newValues[prop] = updates[prop];
	}
	return {
		$set: newValues
	};
};


/** Method to create the location query
 * Gets the coordinates and the distance for the query
 * @param {array} coordinates the coordinates array
 * @param {number} maxDist the max distance for the query
 * @return {object} the query object
 * @private
*/
const createLocationQuery = (coordinates, maxDist) => {
	return {
		location: {
			$near: {
				$geometry: {
					type: "Point",
					coordinates
				},
				$maxDistance: maxDist
			}
		}
	};
};


/** Method to create a query based on a $box
 * Uses the four limits of a map api, based on the current view of
 * the user's map, in order to create a query that returns the
 * users in that particular area.
 * The $box value of the query object is an array with two arrays
 * in it, one with the botton-left coordinates and the other with
 * the top-right coordinates.
 * @param {array} coordsPair the array with the two arrays in it
 * @returns {object} the query object
 * @private
*/
const createGeoWithinQuery = boxCoords => {
	const { top, left, bottom, right } = boxCoords;
	const topLeft = [parseFloat(left), parseFloat(top)];
	const topRight = [parseFloat(right), parseFloat(top)];
	const botRight = [parseFloat(right), parseFloat(bottom)];
	const botLeft = [parseFloat(left), parseFloat(bottom)];
	return {
		location: {
			$geoWithin: {
				$geometry: {
					type: "Polygon",
					coordinates: [[ topLeft, topRight, botRight, botLeft, topLeft]]
				}
			}
		}
	};
};


module.exports = {
	
	// home controller
	homeController(req, res) {
		res.send("Home Route!!!");
	},

	// delete single user
	async deleteSingleUser(req, res, next) {
		const client = await connectToDb;
		client.db(dbName).collection("users").findOneAndDelete({ _id: ObjectId(req.params.userId) })
			.then( result => res.send(result) )
			.catch( e => res.send(e) );
	},
	/* deleteSingleUser(req, res, next) {
		connectToDb
			.then( client => client.db(dbName)
				.collection("users")
				.findOneAndDelete({ _id: ObjectId(req.params.userId) })
			)
			.then( result => {
				res.send(result);
			})
			.catch();
	}, */

	// get all users
	async getAllUser(req, res, next) {
		const client = await connectToDb;
		client.db(dbName).collection("users").find(createGeoWithinQuery(req.query)).toArray()
			.then( users => res.send( users ) )
			.catch( e => res.send( e ) );
		// get the search params from the request
		/* const { lg, lt, dist } = req.query;
		const client = await connectToDb;
		client.db(dbName).collection("users").find( 
			createLocationQuery([parseFloat(lg), parseFloat(lt)], parseFloat(dist) )
		).toArray()
			.then( users => res.send(users) )
			.catch( e => res.send(e) );
		//  */
	},
	/* getAllUser(req, res, next) {
		connectToDb
			.then(client => {
				client.db(dbName).collection('users').find({}).toArray( (err, docs) => {
					if ( err ) res.send({ error: err });
					res.send(docs);
				});
			})
			.catch(e => res.send(e));
		// res.send("GET ALL USERS");
	}, */

	// get specific user
	async getSingleUser(req, res, next) {
		const client = await connectToDb;
		client.db(dbName).collection("users").findOne({ _id: ObjectId(req.params.userId) })
			.then( user => {
				res.send(user);
			})
			.catch( e => res.send(e) );
	},
	/* getSingleUser(req, res, next) {
		connectToDb
			.then(client => client.db(dbName).collection("users").findOne({
				"_id": ObjectId(req.params.userId)
			}))
			.then( doc => {
				res.send(doc);
			})
			.catch( e => res.send(e) );
	}, */

	// edit single user
	async editSingleUser(req, res, next) {
		// create the update object
		const updateObject = createUpdateObject(req.body);
		const client = await connectToDb;
		client.db(dbName).collection("users").findOneAndUpdate(
			{ _id: ObjectId(req.params.userId) },
			updateObject,
			{ returnOriginal: false }
		)
			.then( user => res.send(user) )
			.catch( e => res.send(e) );
		// 
	},
	/* editSingleUser(req, res, next) {
		// get the id from the params and the update from the body
		// from the request body, we can set which fields in the target
		// document will be updated, for that we have to create an update object
		const updateObject = createUpdateObject(req.body);
		connectToDb
			.then( client => client.db(dbName).collection("users").findOneAndUpdate(
				{ "_id": ObjectId(req.params.userId) },
				updateObject,
				{ returnOriginal: false }
			))
			.then( user => {
				res.send( user );
			})
			.catch();
	}, */

	// add new user
	async addNewUser(req, res, next) {
		const client = await connectToDb;
		client.db(dbName).collection('users').insertOne(req.body)
			.then( response => res.send({
				newUserCount: response.insertedCount,
				newUser: response.ops
			}))
			.catch( e => res.send(e) );
	}
	/* addNewUser(req, res, next) {
		connectToDb
			.then( client => {
				console.log( "========\nADD NEW USER" );
				client.db(dbName).collection('users').insertOne(req.body, (err, r) => {
					if( err ) {
						res.send({ error: err });
					} else {
						res.send({
							newItemsCount: r.insertedCount,
							newItems: r.ops
						});
					}
				});
			})
			.catch( e => res.send(e) );
	} */

};
