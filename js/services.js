angular.module('jhvw')

app.factory("jhvwAuth", ["$firebaseAuth",
	function($firebaseAuth) {
		return $firebaseAuth();
	}
])


