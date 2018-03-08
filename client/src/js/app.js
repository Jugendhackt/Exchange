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
		.when('/impressum',{
			templateUrl: 	'pages/impressum_about.html',
		})
		.when('/about',{
			templateUrl: 	'pages/impressum_about.html',
		})
		.when('/project/:id',{
			templateUrl:	'pages/home.html',
			controller:		'ProjectCtrl'
		})
		.when('/prototype/:id',{
			templateUrl:	'pages/home.html',
			controller:		'ProjectCtrl'
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
		$mdThemingProvider.definePalette('jhvw-grey', {
			'50': 	'222222',
			'100': 	'ff0002',
			'200': 	'303539',
			'300': 	'ff0004',
			'400': 	'31363a',
			'500': 	'383d41',
			'600': 	'485056',
			'700': 	'ff0008',
			'800': 	'888888',
			'900': 	'000000',
			'A100':	'ffffff',
			'A200': 'aaaaaa',
			'A400': '222222',
			'A700': 'ff000e',
			'contrastDefaultColor': 'light',    
			                                    
			'contrastDarkColors': 	['A100'],
			//'contrastLightColors':	['50']// could also specify this if default was 'dark'
		})

		$mdThemingProvider.definePalette('jhvw-green', {
			'50': 	'ffaa01',
			'100': 	'ffaa02',
			'200': 	'ffaa03',
			'300': 	'ffaa04',
			'400': 	'8caf0b',
			'500': 	'ffaa06',
			'600': 	'ffaa07',
			'700': 	'ffaa08',
			'800': 	'ffaa09',
			'900': 	'ffaa0a',
			'A100':	'ffaa0b',
			'A200': 'ffaa0c',
			'A400': 'ffaa0d',
			'A700': 'ffaa0e',
			'contrastDefaultColor': 'light',    
			                                    
			// 'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
			//  '200', '300', '400', 'A100'],
			// 'contrastLightColors': undefined    // could also specify this if default was 'dark'
		})


		$mdThemingProvider.definePalette('jhvw-background', {
			'50': 	'888888', //button raised
			'100': 	'00ff02',
			'200': 	'00ff03',
			'300': 	'00ff04',
			'400': 	'00ff05', 
			'500': 	'cccccc', //hover verlay
			'600': 	'00ff07',
			'700': 	'00ff08',
			'800': 	'aaaaaa', ///dialog
			'900': 	'000000', //backdrop
			'A100':	'00ff0b',
			'A200': '00ff0c',
			'A400': '444444',
			'A700': '00ff0e',
			'contrastDefaultColor': 'light',    
			                                    
			'contrastDarkColors': 	['800'],
			//'contrastLightColors':	['50']// could also specify this if default was 'dark'
		})


		$mdThemingProvider.theme('jhvw')
		.primaryPalette('jhvw-grey')
		.accentPalette('jhvw-green') 
		.warnPalette('red')
		.backgroundPalette('jhvw-background')
		.dark()
		
		$mdThemingProvider
		.setDefaultTheme('jhvw')
	}
])

.controller("AppCtrl", [

	'$rootScope',
	'$scope',
	'$mdMedia',
	'$location',
	'$routeParams',
	'$mdDialog',
	'jhvwConfig',
	'jhvwUser',

	function($rootScope, $scope, $mdMedia, $location, $routeParams, $mdDialog, jhvwConfig, jhvwUser) {

		$rootScope.$mdMedia = $mdMedia

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

		$rootScope.goto = function(url){
			window.open(url,'_blank');
		}

		$rootScope.path = function(path){
			$location.path(path)
		}

		$rootScope.$routeParams = $routeParams
	}
])

.run([

	'$rootScope',
	'jhvwUser',
	'jhvwProjects',

	function($rootElement, jhvwUser, jhvwProjects){
		$rootElement.jhvwUser = jhvwUser
	}
])
