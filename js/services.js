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
			self.keepAlive		= undefined

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

								self.keepAlive	= 	$interval(function(){
															self.signIn()
														}, 60000) 
								return id
							})
			}

			self.signOut = function(){

				self.keepAlive && $interval.cancel(self.keepAlive)

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

			dpd.users.on('updated', function(updated_user){
				self.participants.forEach(function(participant, index){
					if(participant.id == updated_user.id) self.participants[index] = updated_user
				})
				
			})

			dpd.messages.on('created', function(message){
				dpd.messages.get({id: message.id})
				.then(function(message){
					self.messages.push(message)
					$rootScope.$apply()
				})
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
	'$http',

	function($q, $http){
		if(!dpd) console.error('jhvwApi: missing dpd.')

		var jhvwUser = this


		jhvwUser.refresh = function(){
			return	$q.when(dpd.users.me())
					.then(function(result){
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
						jhvwUser.refresh()
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
						jhvwUser.refresh()
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


		jhvwUser.loggedIn = function(){
			return !!jhvwUser.data && jhvwUser.data.username
		}

		jhvwUser.update = function(data){
			return	$q.when(dpd.users.put({ id: jhvwUser.data.id }, data))
					.then(jhvwUser.refresh)
		}

		jhvwUser.updateAvatar = function(file){


			var	fd 	= new FormData()

			fd.append("uploadedFile", file)

			return	$http.post('http://localhost:2403/avatars', fd, {
						withCredentials: true,
						headers: {'Content-Type': undefined },
						transformRequest: angular.identity,
						params:{
							uniqueFilename: true
						}
					})
		}



		jhvwUser.ready = jhvwUser.refresh()

		dpd.users.on('updated', function(user){
			if(user.id == jhvwUser.data.id) jhvwUser.refresh() 
		})

	}
])