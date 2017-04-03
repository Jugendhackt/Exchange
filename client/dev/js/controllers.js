angular.module('jhvw')

.controller('ChatCtrl', [

	'$rootScope',
	'$scope',
	'$routeParams',
	'$location',
	'jhvwChat',
	'jhvwUser',

	function($rootScope, $scope, $routeParams, $location, jhvwChat, jhvwUser){

		jhvwUser.ready
		.then(function(){
			if(!jhvwUser.loggedIn()){
				$location.path('/login_or_register')
				return null
			}

			$scope.jhvwUser = jhvwUser


			if($routeParams.room){
				$scope.room = new jhvwChat($routeParams.room)		
				$scope.room.signIn()
			}else{
				$rootScope.gotoRoom()
			}


			$scope.$on('$destroy', function(){
				console.log('signiung out')
				$scope.room && $scope.room.signOut()			
			})

		})


	}
])

.controller('RegisterOrLoginCtrl', [

	'$rootScope',
	'$location',
	'$scope',
	'jhvwUser',

	function($rootScope,$location, $scope, jhvwUser){


		var stop_watching_rootScope  = 	$rootScope.$watch(
											function(){
												return jhvwUser.loggedIn()
											},
											function(){
												if(jhvwUser.loggedIn()) $location.path('/')
											}
										)

		$scope.$on('$destroy', function(){
			stop_watching_rootScope()
		})

	}
])