this.timestamp = new Date().getTime()
this.from = me.id

emit('messages:created', this)