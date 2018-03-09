angular.module('jhvw')

.controller('ChatCtrl', [

	'$rootScope',
	'$scope',
	'$routeParams',
	'$location',
	'jhvwChat',
	'jhvwUser',
	'jhvwConfig',

	function($rootScope, $scope, $routeParams, $location, jhvwChat, jhvwUser, jhvwConfig){


		jhvwUser.ready
		.then(function(){
			if(!jhvwUser.loggedIn()){
				$location.path('/login_or_register')
				return null
			}

			$scope.jhvwUser 	= jhvwUser
			$scope.jhvwConfig	= jhvwConfig


			if($routeParams.room){
				$scope.room = new jhvwChat($routeParams.room)		
				$scope.room.signIn()
			}else{
				$rootScope.gotoRoom()
			}


			$scope.$on('$destroy', function(){
				$scope.room && $scope.room.signOut()			
				console.log('destroy!')
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


.controller('ProjectCtrl', [

	'$scope',
	'$routeParams',
	'jhvwProjects',

	function($scope, $routeParams, jhvwProjects){
		$scope.$watch(function(){
			$scope.project = jhvwProjects.filter(function(project){ return project.id == $routeParams.id})[0]			
		})
	}

])