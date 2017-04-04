"use strict";

angular.module('jhvw')


.directive('focusMe', function(){
	return {
		restrict: 'A',

		link: function(scope, element, attrs){
			if(attrs.focusMe){
				scope.$watch(attrs.focusMe, function(value){
					if(value) window.requestAnimationFrame(function(){
						element.focus()
					})
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
	'$rootScope',
	'jhvwUser',

	function($q, $rootScope, jhvwUser){
		
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
					$rootScope.$emit('jhvwRegisterLoginDone', scope.success ? true :  false)
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


.directive('jhvwHeader', [

	'$routeParams',
	
	function($routeParams){
		return {
			templateUrl: 	'partials/header.html',

			link: function(scope, element){

				scope.$watch(
					function(){ return $routeParams.room},
					function(){ scope.room = $routeParams.room}
				)
			}
		}
	}
])


.directive('jhvwChat', [

	'jhvwConfig',
	'jhvwUser',
	'jhvwChat',

	function(jhvwConfig, jhvwUser, jhvwChat){
		return{
			templateUrl:	'partials/chat.html',
			scope:			{
								jhvwRoom: '<'
							},

			link: function(scope, element){

				scope.jhvwConfig	= jhvwConfig
				scope.message 		= {content:''}

				var content_element = undefined,
					stop_looking_for_content_element = 	scope.$watch(function(){
															if(content_element = element.find('md-content') ){
																stop_looking_for_content_element()															
															}
														})


				scope.postOrLinebreak = function(e){
					if(e.keyCode == 10 || e.keyCode == 13){
						e.ctrlKey 
						?	scope.message.content += '\n'
						:	scope.post()

						e.preventDefault()
						return false
					} 
				}

				scope.post = function(){
					scope.jhvwRoom.post(scope.message.content)
					.then(function(){
						scope.message.content = ''
					})
				}

				scope.scrollToBottom = function(){
					if(!content_element) return null
					content_element[0].scrollTop = content_element[0].scrollHeight
				}

				scope.jhvwUser = jhvwUser
			}
		}
	}
])

.directive('jhvwProfile', [

	'jhvwConfig',
	'jhvwUser',

	function(jhvwConfig, jhvwUser){
		return {
			restrict:		'E',
			templateUrl:	'partials/profile.html',

			link : function(scope, element){

				scope.jhvwConfig		= jhvwConfig
				scope.avatarInputId 	= 'avatarInput'
				scope.avatarFilename	= undefined

				var avatarInput = undefined,
					stop_looking_for_avatar_input = 	scope.$watch(function(){	
															avatarInput = document.getElementById(scope.avatarInputId)																				
															if(avatarInput){
																setupAvatarInput()
																stop_looking_for_avatar_input()
															}
														})

				function setupAvatarInput(el){
					angular.element(avatarInput).on('change', function(){
						scope.avatarFilename = avatarInput.files[0].name
						scope.$digest()
					})
				}

				jhvwUser.ready
				.then(function(){
					scope.jhvwUser 		= 	jhvwUser

					scope.edit			= 	{
												displayName:	jhvwUser.data.displayName,
												city:			jhvwUser.data.city,
												zip:			jhvwUser.data.zip,
												country:		jhvwUser.data.country,
											}
				})

				scope.blur = function(){
					document.activeElement.blur()
				}

				scope.update = function(key, value){		

					var u = {}

					if(typeof key != "string"){
						u = key
					} else {
						u[key] = value
					}

					return jhvwUser.update(u)
				}


				scope.updateAvatar = function(id){					
					jhvwUser.updateAvatar(avatarInput.files[0])					
				}

				scope.deleteAvatar = function(){
					jhvwUser.deleteAvatar()
				}

			}

		}
	}
])


.directive('jhvwWeather', [

	'$http',
	'jhvwConfig',

	function($http, jhvwConfig){
		return {
			
			template:	'<img ng-src ="http://openweathermap.org/img/w/{{weatherData.icon}}.png" title = "{{weatherData.description}}"" alt = "{{weatherData.description}}"></img>',
			scope:	 	{
							city:		'<',
							zip:		'<',
							country:	'<'
						},

			link: function(scope, element){
				var basis 	=	"http://api.openweathermap.org/data/2.5/weather",
					land 	= 	scope.country,
					stadt 	= 	scope.city,
					zip		= 	scope.zip

					scope.weatherData = {}

					scope.$watch(
						function(){
							return [scope.city, scope.zip, scope.country]
						},
						function(){
							console.log(scope.city)
							if(!scope.city && ! scope.zip){
								scope.weatherData = {}
								return null	
							} 
							$http.get(basis, {
								params:	{	
									q: 		(scope.zip || scope.stadt) + scope.country ? ','+scope.country : '',
									mode:	'json',
									units:	'metric',
									lang:	'de',
									APPID:	jhvwConfig.openWeatherMapApiKey
								}
							})
							.then(function(result){
								scope.weatherData = result.data.weather[0]	
							})
						},
						true
					)
			}
		}
	}

])


.filter('jhvwDate',[

	function(){
		return function(timestamp){
			return new Date(timestamp).toLocaleTimeString('de')
		}
	}
])

.filter('countryName',[

	'jhvwConfig',

	function(jhvwConfig){
		return function(code){
			var country = jhvwConfig.countries.filter(function(country){ return country.code == code })[0]
			console.log(code, country)
			return (country && country.name) || code
		}
	}
])


.filter('label', [

	function(){	
		var map = 	{
						city:		'Stadt',
						zip:		'Postleitzahl',
						country:	'Land',
					}

		return function(key){
			return map[key]||key
		}
	}
])

