angular.module('jhvw')

.controller('chatCtrl', [

	'$scope',
	'$routeParams',
	'$location',
	'jhvwChat',

	function($scope, $routeParams, $location, jhvwChat){
		
		$scope.room = $routeParams.room

		$scope.newRoom = function(name){
			$location.path('/r/'+name)
		}
	}
])