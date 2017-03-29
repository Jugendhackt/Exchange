cancelIf(!uniqueFilename, "uniqueFilename parameter must be true.", 400)

dpd.avatars.get()
.then(function(avatars){
    avatars.forEach(function(avatar){
      if(avatar.uploaderId == me.id) dpd.avatars.del(avatar.id)
    })
    dpd.users.put({id:me.id}, {avatar: filename})
})


