cancelIf(this.id != me.id, "Can only edit your own profile.", 401)

if(changed('avatar') && this.avatar == null && previous.avatar){
    console.log('changed avatar detected.')
    dpd.avatars.get({filename: previous.avatar})
    .then(function(avatars){
        console.log('matching avatars: ', avatars)
        avatars.forEach(function(avatar){
            dpd.avatars.del(avatar.id)
        })    
    })
}

emit('users:updated', this)
