var self = this

if(query.room){
    dpd.signins.get({room: query.room, user: this.id})
    .then(function(signins){
        if(!signins || signins.length === 0) cancel()  
    })
}
