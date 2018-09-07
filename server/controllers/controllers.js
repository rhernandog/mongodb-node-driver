const connectToDb = require("../database/database_connection").connectToDb;

module.exports = {
	
	// home controller
	homeController(req, res) {
		res.send("Home Route!!!");
	},

	// get all users
	getAllUser(req, res, next) {
		res.send("GET ALL USERS");
	},

	// get specific user
	getSingleUser(req, res, next) {
		res.send("GET JUST ONE SPECIFIC USER");
	},

	// edit single user
	editSingleUser(req, res, next) {
		res.send("EDIT A SINGLE USER");
	},

	// add new user
	addNewUser(req, res, next) {
		connectToDb()
			.then( client => {
				console.log( "===========\nRequest body", req.body );
				client.db("MongoDriverData").collection('users').insertOne(req.body, ( err, response) => {
					if ( err ) throw(err);
					console.log( "===========\nUSER CREATED!!!" );
					console.log( response );
					client.close();
					res.send(response);
				});
			})
			.catch( e => res.send({ error: e }) );
		// 
	}

};
