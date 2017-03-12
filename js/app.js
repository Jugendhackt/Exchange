angular.module('jhvw', [
	'ngMaterial',
	'ngRoute',
])


.config([
	'$routeProvider',

	function($routeProvider){
		$routeProvider
		.when('/r/:room?',{
			controller:		'chatCtrl',
			templateUrl: 	'pages/chat.html'
		})
		.otherwise({
			redirectTo: '/r/'
		})
	}
])


.controller("AppCtrl", [
	'$scope',
	'$mdDialog',
	'jhvwUser',

	function($scope, $mdDialog, jhvwUser) {

		$scope.register = function(ev){
			$mdDialog.show({
				parent: 				angular.element(document.body),
				targetEvent: 			ev,
				clickOutsideToClose: 	true,
				template:				'<jhvw-login-register register = "true" layout-padding></jhvw-login-register>',

				controller:	function($scope,  $mdDialog){
					$scope.$on('jhvwRegisterLoginDone', $mdDialog.hide)
				}
			})
		}

		$scope.login = function(ev){
			$mdDialog.show({
				parent: 				angular.element(document.body),
				targetEvent: 			ev,
				clickOutsideToClose: 	true,
				template:				'<jhvw-login-register layout-padding></jhvw-login-register>',

				controller:	function($scope,  $mdDialog){
					$scope.$on('jhvwRegisterLoginDone', $mdDialog.hide)
				}
			})
		}

		$scope.logout = function(){
			jhvwUser.logout()
		}
	}
])

.run([

	'$rootScope',
	'jhvwUser',

	function($rootElement, jhvwUser){
		$rootElement.jhvwUser = jhvwUser
	}
])
