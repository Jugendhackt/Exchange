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

		link: function(scope, element, attrs){
			if(attrs.focusMe){
				scope.$watch(attrs.focusMe, function(value){
					if(value) element.focus()
				})
			} else {
				element.focus()
			}
		}
	}
})

.filter('underscores', function(){
	return function(str){
		return str.replace(/\s/,'_')
	}
})



.directive('jhvwLoginRegister',[

	'$q',
	'jhvwUser',

	function($q, jhvwUser){
		
		return {
			restrict:       'AE',
			templateUrl:    '/partials/login_register.html',
			scope:			true,

			link: function(scope, element, attrs){

				

				scope.back = function(){ 
					switch(scope.step){
						case 'password':	scope.step = 'username'; 	break
						case 'error': 		scope.reset(); 				break
					}
				}

				scope.reset = function(){
					scope.step 		=	'username'
					scope.data		=	{
										username:	'',
										password: 	''
									}
					scope.errors	= undefined
					scope.message	= undefined
					scope.user		= undefined
				}

				scope.register = function() {
					jhvwUser.register(scope.data.username, scope.data.password)
					.then(
						function(user) {
							scope.user		= user
							scope.message 	= "Benutzer angelegt."
							scope.step 		= 'login'
						},
						function(response) {
							scope.errors 	= response.errors
							scope.step		= 'error'
						}
					)

				}

				scope.login = function(){
					jhvwUser.login(scope.data.username, scope.data.password)
					.then(
						function(){
							scope.done()
						},
						function(response){
							scope.errors 	= {login: response && response.message}
							scope.step		= 'error'
						}
					)
				}

				scope.done = function(){
					scope.$emit('jhvwRegisterLoginDone', scope.success ? true :  false)
				}

				scope.submit = function(){
					switch(scope.step){
						case 'username':	scope.step = 'password'; break
						case 'password': 	attrs.register ? scope.register() : scope.login(); break
						case 'login':		scope.login(); break;
						case 'error':		scope.done(); break
					}
				}

				scope.reset()	
			}
		}
	}
])




.directive('jhvwChat',[

	'jhvwChat',

	function(jhvwChat){
		return {
			restrict:		'E',
			templateUrl:	'/partials/chat.html',
			scope:			{
								room: '<'
							},


			link: function(scope, element){
				scope.$watch('room', function(){
					scope.chat = new jhvwChat(scope.room)					
				})
			}
		}
	}
])