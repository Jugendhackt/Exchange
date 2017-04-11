angular.module('jhvw')


.service('jhvwConfig', [
	'$http',

	function($http){
		var self = this
		$http.get('config.json')
		.then(function(result){
			for(key in result.data) self[key] = result.data[key]
		})

		$http.get('countries_de.json')
		.then(function(result){
			self.countries = result.data
		})

		return self
	}
])


.service('jhvwChat', [

	'$rootScope',
	'$q',
	'$interval',

	function($rootScope, $q, $interval){
		if(!dpd) console.error('jhvwApi: missing dpd.')
	
		function jhvwChat(room){

			if(!room) console.error('jhvwChat: missing room id.')

			var self = this

			self.room 			= room
			self.messages 		= []
			self.participants 	= []
			self.signinId		= undefined
			self.keepAlive		= undefined
			self.newMessages	= 0

			self.post = function(content){
				return $q.when(dpd.messages.post({
					room:		self.room,
					content:	content
				}))
			}

			self.signIn = function(){

				return 	self.signinId
						?	$q.when(dpd.signins.put(self.signinId))

						:	$q.when(dpd.signins.post({ room:	self.room }))
							.then(function(signin){
								self.signinId = signin.id

								self.keepAlive	= 	$interval(function(){
															self.signIn()
														}, 60000) 

								updateParticipantsList()
								
								dpd.signins.on(		'updated', updateParticipantsList)
								dpd.users.on(		'updated', updateParticipant)
								dpd.messages.on(	'created', addMessage)
								return signin.id
							})
			}

			self.signOut = function(){

				self.keepAlive && $interval.cancel(self.keepAlive)

				dpd.signins.off(	'updated', updateParticipantsList)
				dpd.users.off(		'updated', updateParticipant)
				dpd.messages.off(	'created', addMessage)

				return 	self.signinId
						?	$q.when(dpd.signins.del(self.signinId))
						:	$q.reject()


			}

			function updateParticipantsList(){
				$q.when(dpd.users.get({room : self.room}))
				.then(function(participants){				
					self.participants 	= 	participants
				})
			}

			function updateParticipant(updated_user){
				var updated_participant = self.participants.filter(function(participant){ return participant.id == updated_user.id })[0]						

				if(updated_participant){
					$q.when(dpd.users.get({id: updated_participant.id}))
					.then(function(user){
						for(key in user){
							updated_participant[key] = user[key]
						}						
					}) 
				}

				self.messages.forEach(function(message){
					if(message.from.id == updated_participant.id)	message.from = updated_participant
				})
			}

			function addMessage(message){
				dpd.messages.get({id: message.id})
				.then(function(message){
					self.messages.push(message)
					$rootScope.$apply()
				})
			}
	
			self.ready =	$q.when(dpd.messages.get({
								room: self.room
							}))
							.then(function(messages){	
								return self.messages = messages								

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
	'jhvwConfig',

	function($q, $http, jhvwConfig){
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


			return	$http.post(jhvwConfig.backendLocation+'/avatars', fd, {
						withCredentials: true,
						headers: {'Content-Type': undefined },
						transformRequest: angular.identity,
						params:{
							uniqueFilename: true
						}
					})
		}

		jhvwUser.deleteAvatar = function(){
			return	$q.when($q.when(dpd.users.put({ id: jhvwUser.data.id }, {avatar:null})))
					.then(function(){
						return jhvwUser.refresh()
					})
		}


		jhvwUser.ready = jhvwUser.refresh()

		dpd.users.on('updated', function(user){
			if(user.id == jhvwUser.data.id) jhvwUser.refresh() 
		})

	}
])