cancelUnless(me, "You are not logged in", 401);


this.timestamp = new Date().getTime()
this.from = me.id

emit('messages:created', this)