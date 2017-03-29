angular.module('jhvw')

.controller('ChatCtrl', [

	'$scope',
	'$routeParams',
	'$location',
	'jhvwChat',
	'jhvwUser',

	function($scope, $routeParams, $location, jhvwChat, jhvwUser){

		jhvwUser.ready
		.then(function(){
			if(!jhvwUser.loggedIn()) $location.path('/login_or_register')

			$scope.room 	= $routeParams.room
			$scope.message 	= {content:''}

			$scope.newRoom = function(name){
				$location.path('/r/'+name)
			}

			$scope.postOrLinebreak = function(e){
				if(e.keyCode == 10 || e.keyCode == 13){
					e.ctrlKey 
					?	$scope.message.content += '\n'
					:	$scope.post()

					e.preventDefault()
					return false
				} 
			}

			$scope.post = function(){
				$scope.chat.post($scope.message.content)
				$scope.message.content = ''
			}

			if($scope.room){
				$scope.chat = new jhvwChat($scope.room)		
				$scope.chat.signIn()
			}

			$scope.jhvwUser = jhvwUser

			$scope.$on('$destroy', function(){
				$scope.chat && $scope.chat.signOut()			
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
												console.log('LOR')
												if(jhvwUser.loggedIn()) $location.path('/')
											}
										)

		$scope.$on('$destroy', function(){
			stop_watching_rootScope()
		})

	}
])