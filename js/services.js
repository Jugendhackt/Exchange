angular.module('jhvw')

.factory("jhvwAuth", ["$firebaseAuth",
	function($firebaseAuth) {
		return $firebaseAuth();
	}
])


