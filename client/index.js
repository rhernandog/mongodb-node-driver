navigator.geolocation.getCurrentPosition( function(pos) {
	console.log( pos );
});

const myLocation = [-33.448140, -70.571829];

const revertCoordinates = coordinates => coordinates.reverse();

/** Send the location query parameters to the server
 * 
*/
function makeLocationQuery(coords, maxDist) {
	axios.get(`http://localhost:3080/users?lg=${coords[1]}&lt=${coords[0]}&dist=${maxDist}`)
		.then(function (response) {
			console.log(response);
		})
		.catch(function (error) {
			console.log(error);
		});
	// 
}

makeLocationQuery([-33.448140, -70.571829], 1500);
