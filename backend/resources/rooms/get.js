cancelUnless(isRoot || internal || me, 'Not logged in.', 401)

var query = (isRoot || internal)
            ?   {}
            :   {from: me.id}

dpd.messages.get(query)
.then(function(messages){

	var	rooms = {}

	messages.forEach(function(message){
		rooms[message.room] = 	rooms[message.room] || {
									name:			message.room,
									message_count:	0,
									latest:			0
								}

        rooms[message.room].message_count ++  

		rooms[message.room].latest = 	parseInt(message.timestamp) < rooms[message.room].latest
								        ?	rooms[message.room].latest
								        :   message.timestamp
									
	})

	var arr = []

	for(var name in rooms){	arr.push(rooms[name]) }

	arr.sort(function(room1, room2){
		return room2.latest - room1.latest
	})

    setResult(arr)
})