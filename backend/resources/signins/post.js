cancelUnless(me, "You are not logged in", 401)

dpd.signins.get({room : this.room, user: me.id})
.then(function(signins){
    signins.forEach(function(signin){
        dpd.signins.del(signin.id)   
    })
})

this.timestamp = new Date().getTime()
this.user = me.id

emit(dpd.users, {room: this.room }, 'signins:updated')