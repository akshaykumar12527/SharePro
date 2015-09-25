var request2 = require('request')
var accountSid = 'AC41380ad3f19ff53841b1ba46dd89c755';
// var authToken = "[auth_token]";
var authToken='b4b82dc639c97907027f827ac3c01654';
var client = require('twilio')(accountSid, authToken);
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
    client.messages.create({
    body: "Testing",
    to: "+919810959556",
    from: "+17079985983"
}, function(err, message) {
    // process.stdout.write(message.sid);
    if (!err) {
            if(cb)
                cb(true);
        } else {
            console.log('err.message='+err.message);
            if(cb)
                cb(false);
        }
});
/*
    var options = method.config;
    options.qs.mnumber=options.qs.mnumber+number;
    
    // var basecampname = basecamp;

    if(msg)
        switch(msg){
            case 1:
                break;
            default:
                options.qs.message = "Thanks for downloading SharePro." ;
                break;
        }

    request2('http://luna.a2wi.co.in:7501/failsafe/HttpLink', options, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            if(cb)
                cb(true);
        } else {
            if(cb)
                cb(false);
        }
 })
*/

}

SMS = {
    send:method.send
}

module.exports = SMS

