angular.module('jhvw', [
	'ngMaterial',
	'ngRoute',
])


.config([
	'$routeProvider',
	'$locationProvider',

	function($routeProvider, $locationProvider){
		$routeProvider
		.when('/r/:room',{
			controller:		'ChatCtrl',
			templateUrl: 	'pages/chat_room.html',
		})
		.when('/r',{
			templateUrl: 	'pages/rooms.html',
		})
		.when('/rooms',{
			templateUrl: 	'pages/rooms.html',
		})
		.when('/profile',{
			templateUrl: 	'pages/profile.html',
		})
		.when('/login_or_register',{
			controller:		'RegisterOrLoginCtrl',
			templateUrl:	'pages/login_or_register.html',	
		})
		.when('/',{
			templateUrl: 	'pages/home.html',
		})
		.otherwise({
			redirectTo: '/'
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
	'$routeParams',
	'$mdDialog',
	'jhvwConfig',
	'jhvwUser',

	function($rootScope, $scope, $location, $routeParams, $mdDialog, jhvwConfig, jhvwUser) {

		$rootScope.gotoRoom = function(name){

			return	name
					?	$location.path('/r/'+name)
					:	$location.path('/rooms')
			

		}

		$rootScope.register = function(ev){
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

		$rootScope.login = function(ev){
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

		$rootScope.logout = function(){
			jhvwUser.logout()
			.then(function(){
				$location.path('/')
			})
		}

		$rootScope.$routeParams = $routeParams
	}
])

.run([

	'$rootScope',
	'jhvwUser',

	function($rootElement, jhvwUser){
		$rootElement.jhvwUser = jhvwUser
	}
])
