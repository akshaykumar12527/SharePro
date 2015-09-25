var request2 = require('request')
var accountSid = 'PN6b20979ca1b12c150e704a9f98ab8336';
var authToken = "{{ auth_token }}";
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
    to: "+917206639567",
    from: "+13619495685"
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

