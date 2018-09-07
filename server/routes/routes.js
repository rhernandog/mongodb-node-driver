// get the controllers code
const userControllers = require("../controllers/controllers");

module.exports = app => {

	// home route
	app.get("/", userControllers.homeController);

	// get all users
	// add new user
	app.route("/users")
		.get(userControllers.getAllUser)
		.post(userControllers.addNewUser);
	// 

	// get a single user
	// edit a single user
	app.route("/users/:userId")
		.get(userControllers.getSingleUser)
		.put(userControllers.editSingleUser);
	// 
};