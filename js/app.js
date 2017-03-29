angular.module('jhvw', [
	'ngMaterial',
	'ngRoute',
])


.config([
	'$routeProvider',
	'$locationProvider',

	function($routeProvider, $locationProvider){
		$routeProvider
		.when('/r/:room?',{
			controller:		'ChatCtrl',
			templateUrl: 	'pages/chat_room.html',
		})
		.when('/login_or_register',{
			controller:		'RegisterOrLoginCtrl',
			templateUrl:	'pages/login_or_register.html',	
		})
		.otherwise({
			redirectTo: '/r/'
		})
		 
		$locationProvider
		.html5Mode(true)
		
	}
])


.config([

	'$mdThemingProvider',

	function($mdThemingProvider) {
		$mdThemingProvider.theme('jhvw')
		.primaryPalette('indigo')
		.accentPalette('light-green') 
		.warnPalette('red')
		.backgroundPalette('grey')
		
		$mdThemingProvider
		.setDefaultTheme('jhvw')
	}
])

.controller("AppCtrl", [

	'$rootScope',
	'$scope',
	'$location',
	'$mdDialog',
	'jhvwUser',

	function($rootScope, $scope, $location, $mdDialog, jhvwUser) {

		$scope.register = function(ev){
			$mdDialog.show({
				parent: 				angular.element(document.body),
				targetEvent: 			ev,
				clickOutsideToClose: 	true,
				template:				'<jhvw-login-register register = "true" layout-padding></jhvw-login-register>',

				controller:	function($scope,  $mdDialog){
					$rootScope.$on('jhvwRegisterLoginDone', $mdDialog.hide)
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
					$rootScope.$on('jhvwRegisterLoginDone', $mdDialog.hide)
				}
			})
		}

		$scope.logout = function(){
			jhvwUser.logout()
			.then(function(){
				$location.path('/')
			})
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
