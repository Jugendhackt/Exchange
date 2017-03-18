angular.module('jhvw')

.controller('chatCtrl', [

	'$scope',
	'$routeParams',
	'$location',
	'jhvwChat',
	'jhvwUser',

	function($scope, $routeParams, $location, jhvwChat, jhvwUser){

		
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

	}
])