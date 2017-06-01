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

				scope.$routeParams = $routeParams
			}
		}
	}
])


.directive('jhvwChat', [

	'jhvwConfig',
	'jhvwUser',
	'jhvwChat',
	'$mdToast',
	'$mdMedia', 

	function(jhvwConfig, jhvwUser, jhvwChat, $mdToast, $mdMedia){
		return{
			templateUrl:	'partials/chat.html',
			scope:			{
								jhvwRoom: '<'
							},

			link: function(scope, element){

				scope.jhvwConfig			= jhvwConfig
				scope.message 				= {content:''}
				scope.originalMessageCount	= undefined
				scope.batchCount			= 1
				scope.batchSize				= 10
				scope.limit 				= undefined
				scope.unreadMessages		= 0

				var content_element = element.find('md-content')[0]

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
						if($mdMedia('xs')) document.activeElement.blur()	
					})
				}

				scope.scrollToLastMessage = function(){
					content_element.scrollTop = content_element.scrollHeight
				}

				scope.jhvwUser = jhvwUser

				scope.jhvwRoom.ready
				.then(function(){
					scope.originalMessageCount = scope.jhvwRoom.messages.length

					scope.$on('unreadMessage',	function(){ scope.unreadMessages ++ })
					scope.$on('messageRead',	function(){ scope.unreadMessages -- })


					var toast = 	$mdToast.simple()
									.position('top')
									.textContent('Neue Nachricht')
									.action('anzeigen')
									.highlightAction(true)								
									.parent(content_element)

					scope.$watch('unreadMessages', function(current_count, previous_count){
						if(current_count > previous_count){
							$mdToast.show(toast)
							.then(function(response){
								if(response == 'ok') scope.scrollToLastMessage()
							})
						}
					})

					scope.$watch(
						function(){ return [scope.jhvwRoom && scope.jhvwRoom.messages.length, scope.batchCount]},
						function(){
							var new_messages = scope.jhvwRoom.messages.length - scope.originalMessageCount
							
							scope.limit = new_messages + scope.batchCount * scope.batchSize
							if(scope.limit >= scope.jhvwRoom.messages.length) scope.noMoreItems = true
						},
						true
					)
				})

			}
		}
	}
])

.directive('jhvwMessage', [

	'jhvwUser',

	function(jhvwUser){
		return {
			restrict: 'A',

			link: function(scope, element, attrs){

				var parent = element.parent(),
					message = scope.$eval(attrs.jhvwMessage)

				if(!message) return null

				if(message.from.id == jhvwUser.data.id){
					parent[0].scrollTop = parent[0].scrollHeight					
					return null
				}

				if(element[0].offsetTop - parent[0].scrollTop < 1.5*parent[0].clientHeight){
					parent[0].scrollTop = parent[0].scrollHeight
					return null						
				}


				scope.$emit('unreadMessage', element)

				function onScroll(){
					if(element[0].offsetTop - parent[0].scrollTop > parent[0].clientHeight/2) return null

					scope.$emit('messageRead', element)
					parent.off('scroll', onScroll)
				}

				parent.on('scroll', onScroll)

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

				scope.jhvwConfig			= jhvwConfig
				scope.avatarInputId 		= 'avatarInput'
				scope.avatarFilename		= undefined
				scope.browserTimeZoneOffset = new Date().getTimezoneOffset()/60

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
												info:			jhvwUser.data.info,	
												tzOffset:		jhvwUser.data.tzOffset,	
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
	'$interval',

	function($http, jhvwConfig, $interval){
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
					zip		= 	scope.zip,
					stop	=	$interval(update, 15*60*1000)

					scope.weatherData = {}

					function update(){
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
					}



					scope.$watch(
						function(){
							return [scope.city, scope.zip, scope.country]
						},
						update,
						true
					)

					scope.$on('$destroy', stop)
			}
		}
	}

])


.directive('jhvwRoomList', [

	function(){
		return {

			templateUrl: 	'/partials/room_list.html',
			scope: 			true,

			link: function(scope, element){

				function update(){
					dpd.rooms.get()
					.then(function(rooms){
						console.log(rooms)
						scope.rooms = rooms
						scope.$digest()
					})
				}

				update()

				dpd.messages.on('created', update)

				scope.$on('$destroy', function(){
					dpd.messages.off('created', update)
				})
			}
		}
	}
])


.filter('up', [
	function(){
		return function(arr, key, value){
			return 	arr.sort(function(item_1, item_2){
						return 	(item_2[key] == value ? 1 : 0) - (item_1[key] == value ? 1 : 0 )
					})
		}
	}
])

.filter('jhvwDate',[

	function(){
		return function(timestamp, time_only, minutes_only){
			var date 		= new Date(timestamp),
				date_str	= date.toLocaleDateString(),
				time_str 	= date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})

			return (time_only ? '' : date_str +', ')+time_str
		}
	}
])

.filter('countryName',[

	'jhvwConfig',

	function(jhvwConfig){
		return function(code){
			var country = jhvwConfig.countries.filter(function(country){ return country.code == code })[0]
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

