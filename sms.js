var request2 = require('request')
var accountSid = 'AC41380ad3f19ff53841b1ba46dd89c755';
// var authToken = "[auth_token]";
var authToken='b4b82dc639c97907027f827ac3c01654';
var client = require('twilio')(accountSid, authToken);
var exotel = require('exotel')({
   id   : "hatchitup",// exotel id,
   token: "6ebf85739589d495e2910767c2bcb48bde10c7d9"// exotel token
});
var SMS = new Object();
var method = new Object();

method.config  = {
         method: 'GET',
         uri: 'http://luna.a2wi.co.in:7501/failsafe/HttpLink',
         qs: {
             aid: 630972,
             pin: "lou@1",
             mnumber: "91",
             message:"",
             signature: "SharePro"
         }
}

method.send = function(number,cb,msg){
    /*client.messages.create({
    body: "Testing",
    to: "+919810959556",
    from: "+17079985983"
}, function(err, message) {
    process.stdout.write(message.sid);
    if (!err) {
            if(cb)
                cb(true);
        } else {
            console.log('err.message='+err.message);
            if(cb)
                cb(false);
        }
});*/
exotel.sendSMS('9627490113', 'Hi Akshay, your number 9810959556 is now turned 123.', function (err, res) {
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

