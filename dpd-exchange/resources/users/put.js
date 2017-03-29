cancelIf(this.id != me.id, "Can only edit your own profile.", 401)

emit('users:updated', this)

if(!internal) protect('avatar')