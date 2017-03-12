angular.module('jhvw')


.service('jhvwChat', [

	'$rootScope',
	'$q',

	function($rootScope, $q){
		if(!dpd) console.error('jhvwApi: missing dpd.')
	
		function jhvwChat(room){

			var self = this

			self.room = room
			self.messages = []

			self.post = function(content){

				return $q.when(dpd.messages.post({
					room:		self.room,
					content:	content
				}))
			}

			dpd.messages.on('created', function(message){
				self.messages.push(message)
				$rootScope.$apply()
			})

			$q.when(dpd.messages.get({
				room: self.room
			}))
			.then(function(messages){
				messages = messages || []
				;[].push.apply(self.messages, messages)
			})
		}

		return jhvwChat
	}
])

.service('jhvwUser',[
	'$q',

	function($q){
		if(!dpd) console.error('jhvwApi: missing dpd.')

		var jhvwUser = this

		jhvwUser.update = function(){
			dpd.users.me(function(result, error){
				jhvwUser.data = result
			})
		}

		jhvwUser.register = function(username, password){
			return 	$q.when(
						dpd('users').post({
							username:	username,
							password:	password
						})
					)
					.finally(function(){
						jhvwUser.update()
					})
		}

		jhvwUser.login = function(username, password){
			return 	$q.when(
						dpd.users.login({
							username: username, 
							password: password
						})
					)
					.finally(function(){
						jhvwUser.update()
					})
		}

		jhvwUser.logout = function(){
			return 	$q.when(
						dpd.users.logout()
					)
					.then(function(){
						jhvwUser.data = null
					})

		}

		jhvwUser.update()

	}
])