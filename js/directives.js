angular.module('jhvw')



// and use it in our controller
// .controller("AuthCtrl", 
// 	[
// 		'$scope', 
// 		'Auth',

// 		function($scope, Auth) {
// 			$scope.createUser = function() {
// 				$scope.message 	= null;
// 				$scope.error 	= null;

// 				// Create a new user
// 				Auth.$createUserWithEmailAndPassword($scope.email, $scope.password)
// 					.then(function(firebaseUser) {
// 						$scope.message = "User created with uid: " + firebaseUser.uid;
// 					}).catch(function(error) {
// 						$scope.error = error;
// 					})
// 			}

// 			$scope.deleteUser = function() {
// 				$scope.message = null;
// 				$scope.error = null;

// 				// Delete the currently signed-in user
// 				Auth.$deleteUser().then(function() {
// 					$scope.message = "User deleted";
// 				}).catch(function(error) {
// 					$scope.error = error;
// 				})
// 			}
// 		}
// ])


.directive('focusMe', function(){
	return {
		restrict: 'A',

		link: function(scope, element){
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
			scope:          {
								onSuccess : '&',
							},

			link: function(scope, element){

				
				scope.done		= false


				console.log(scope.onSuccess())

				scope.back = function(){ 
					switch(scope.step){
						case 'password':	scope.step = 'mail'; 		break
						case 'error': 		scope.reset(); 				break
					}
				}

				scope.reset = function(){
					scope.step 		=	'mail'
					scope.data		=	{
										email: 		'',
										password: 	''
									}
				}

				scope.createUser = function(email, password) {
					jhvwAuth.$createUserWithEmailAndPassword(email, password)
					.then(function(firebaseUser) {
						scope.message 	= "Benutzer angelegt (" + firebaseUser.uid + ")"
						scope.step 		= 'success'
					}).catch(function(error) {
						scope.error 	= error
						scope.step		= 'error'
					})
				}

				scope.submit = function(){
					switch(scope.step){
						case 'mail':		scope.step = 'password'; break
						case 'password': 	scope.createUser(scope.data.email, scope.data.password); break
						case 'success': 	scope.onSuccess(); break
					}
				}

				scope.reset()	
			}
		}
	}
])




.directive('jhvwChat',[

	'$firebaseArray',
	'jhvwAuth',

	function($firebaseArray, jhvwAuth){
		return {
			restrict:		'E',
			templateUrl:	'/partials/chat.html',
			scope:			true,


			link: function(scope, element){
				var ref = firebase.database().ref().child("messages")

				scope.messages = $firebaseArray(ref)



				scope.post = function(){
					scope.messages.$add({content: scope.content, from: jhvwAuth.$getAuth().email, timestamp: firebase.database.ServerValue.TIMESTAMP})
				}
			}
		}
	}
])