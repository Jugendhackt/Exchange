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
	'$routeParams',
	'$mdDialog',
	'jhvwConfig',
	'jhvwUser',

	function($rootScope, $scope, $location, $routeParams, $mdDialog, jhvwConfig, jhvwUser) {

		$rootScope.gotoRoom = function(name){

			if(name) return $location.path('/r/'+name)

			$mdDialog.show(
				$mdDialog.prompt()
				.title('Raum auswählen:')
				.initialValue($routeParams.room)
				.ok('Weiter')
				.cancel('Abbrechen')
			)
			.then(function(name){
				$rootScope.gotoRoom(name)
			})
			

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
	}
])

.run([

	'$rootScope',
	'jhvwUser',

	function($rootElement, jhvwUser){
		$rootElement.jhvwUser = jhvwUser
	}
])
