cancelUnless(this.user == me.id, "You are not allowed to sign in/out for other users", 401)

this.timestamp = new Date().getTime()

emit('signins:updated')