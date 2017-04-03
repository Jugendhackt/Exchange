var time = new Date().getTime()

if(time-this.timestamp > 1000 * 60){
    dpd.signins.del(this.id)
    cancel()
}