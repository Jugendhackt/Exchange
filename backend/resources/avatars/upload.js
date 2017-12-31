cancelUnless(uniqueFilename, "uniqueFilename parameter must be true.", 400)
cancelUnless(me, "You are not logged in", 401)
cancelUnless(filesize <= 500 * 1024, "Filesize must be smaller than 500kb")


console.log('avatars: onupload')
console.log(this)
console.log(filename, '#################')

console.log(filesize)

dpd.avatars.get({uploaderId: me.id})
.then(function(avatars){
    console.log(avatars)
    avatars.forEach(function(avatar){
        dpd.avatars.del(avatar.id)    
    })
})

dpd.users.put({id:me.id}, {avatar: filename})


