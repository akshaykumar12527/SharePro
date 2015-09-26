var exotel = require('exotel')({
   id   : "hatchitup",// exotel id,
   token: "6ebf85739589d495e2910767c2bcb48bde10c7d9"// exotel token
});
var SMS = new Object();
var method = new Object();

method.send = function(number,cb,OTP){
    
exotel.sendSMS(number, 'Hi User, your number '+number+' is now turned '+OTP+'.', function (err, res) {
   if (!err) {
            if(cb)
                cb(true);
        } else {
            console.log('err.message='+err.message);
            if(cb)
                cb(false);
        }
}); 
}

SMS = {
    send:method.send
}

module.exports = SMS

