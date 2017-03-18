angular.module('jhvw')


.service('jhvwChat', [

	'$rootScope',
	'$q',
	'$interval',

	function($rootScope, $q, $interval){
		if(!dpd) console.error('jhvwApi: missing dpd.')
	
		function jhvwChat(room){

			var self = this

			self.room 			= room
			self.messages 		= []
			self.participants 	= []
			self.signinId		= undefined
			self.updateInterval	= undefined

			self.post = function(content){

				return $q.when(dpd.messages.post({
					room:		self.room,
					content:	content
				}))
			}

			self.signIn = function(){

				return 	self.signinId

						?	$q.when(dpd.signins.put(self.signinId))
							.then(function(signIn){
								self.signinId = self.signIn.id
							})

						:	$q.when(dpd.signins.post({
								room:	self.room
							}))
							.then(function(id){
								self.signinId = id

								self.updateInterval	= 	$interval(function(){
															self.signIn()
														}, 60000) 
								return id
							})
			}

			self.signOut = function(){

				self.updateInterval && $interval.cancel(self.updateInterval)

				return 	self.signinId
						?	$q.when(dpd.signins.del(self.signinId))
						:	$q.reject()


			}


			dpd.signins.on('updated', function(result){
				$q.when(dpd.users.get({room : self.room}))
				.then(function(participants){				
					self.participants 	= 	participants
				})
			})

			dpd.messages.on('created', function(message){
				self.messages.push(message)
				$rootScope.$apply()
			})


			$q.when(dpd.messages.get({
				room: self.room
			}))
			.then(function(messages){
				self.messages = messages
				// messages = messages || []
				// ;[].push.apply(self.messages, messages)
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