angular.module('jhvw')





// and use it in our controller
.controller("AuthCtrl", 
	[
		'$scope', 
		'Auth',

		function($scope, Auth) {
			$scope.createUser = function() {
				$scope.message 	= null;
				$scope.error 	= null;

				// Create a new user
				Auth.$createUserWithEmailAndPassword($scope.email, $scope.password)
					.then(function(firebaseUser) {
						$scope.message = "User created with uid: " + firebaseUser.uid;
					}).catch(function(error) {
						$scope.error = error;
					})
			}

			$scope.deleteUser = function() {
				$scope.message = null;
				$scope.error = null;

				// Delete the currently signed-in user
				Auth.$deleteUser().then(function() {
					$scope.message = "User deleted";
				}).catch(function(error) {
					$scope.error = error;
				})
			}
		}
])


.directive('focusMe', function(){
	return {
		restrict: 'A',

		link: function(scope, element){
			console.log('ADFADSFFDSADSA')
			element.focus()
		}
	}
})



.directive('jhvwRegister',[

	'jhvwAuth',

	function(jhvwAuth){
		
		return {
			restrict:       'AE',
			templateUrl:    '/partials/register.html',
			scope:          true,

			link: function(scope, element){

				scope.step = 0

				scope.next = function(){ scope.step ++ }
				scope.back = function(){ scope.step -- }

				scope.createUser = function(email, password) {
					scope.message 	= null
					scope.error 	= null

					jhvwAuth.$createUserWithEmailAndPassword(email, password)
					.then(function(firebaseUser) {
						scope.message = "User created with uid: " + firebaseUser.uid;
					}).catch(function(error) {
						scope.error = error;
					})
				}

			}
		}
	}
])