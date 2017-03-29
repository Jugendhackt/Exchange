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

.directive('scrollToBottom', [

	function(){
		return {
			restrict: 'A',
			link: function(scope, element, attrs){
				scope.$watch(attrs.scrollToBottom, function(){
					element[0].scrollTop = element[0].scrollHeight
				}, true)
				element[0].scrollTop = element[0].scrollHeight
			}
		}
	}
])


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


.directive('jhvwProfile', [

	'jhvwUser',

	function(jhvwUser){
		return {
			retsrict:		'E',
			templateUrl:	'partials/profile.html',

			link : function(scope, element){

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

				scope.jhvwUser = jhvwUser

				scope.blur = function(){
					document.activeElement.blur()
				}

				scope.updateDisplayName = function(displayName){
					return jhvwUser.update({ displayName: 	displayName	})
				}

				scope.updateAvatar = function(id){					
					jhvwUser.updateAvatar(avatarInput.files[0])					
				}


			}

		}
	}
])


