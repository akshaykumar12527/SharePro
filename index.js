var express=require("express");
var router = express.Router();
var session=require("express-session");
var SMS = require('./sms');
var tables = require('./tables/tables');
var multer=require("multer");
var bodyParser=require('body-parser');
var app=express();
var fs = require("fs");
app.set('port', (process.env.PORT || 8000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'ssshhhhh'}));
app.use('/',router);

var OTP;
var response = {
  error:false,
  code:"",
  data:null,
  userMessage:'',
  errors:null
};
var User={
	phoneNumber:'',
	OTP:''
};
var NullResponseValue = function () {
  response = {
    error:false,
    code:"",
    data:null,
    userMessage:'',
    errors:null
  };
  return true;
};
var SendResponse = function (res) {
  res.send(response);
  NullResponseValue();
  res.end();
};

app.use(multer({ dest: 'public/upload/',
	 rename: function (fieldname, filename) {
	    return filename+Date.now();
	  },
	onFileUploadStart: function (file) {
	  console.log(file.originalname + ' is starting ...');
	},
	onFileUploadComplete: function (file) {
	  console.log(file.fieldname + ' uploaded to  ' + file.path);
	  file_path=file.path;
	  file_name=file.name;
	  done=true;
	}
	}));
// app.use(express.static(__dirname+"/public"));
// app.get('/',function(req,res){
// 	console.log(req.url);
// 	res.sendFile(__dirname+'/public/signup.html');
// });
router.route('/test/:data')
.post(function(req,res){
	
	console.log(req.body,req.params);
	res.send(req.params);
});
/*****************************Login route******************************/
router.route('/authenticate/:phoneNumber/:OTP')
.post(function(req,res){
	User=req.session.User;
	if(User){
		console.log(User,res.body);
		if(req.params.OTP==User.OTP && req.params.phoneNumber==User.phoneNumber){
			tables.insertUser(User,function(done){
				if(done){
					response.error=false;
					response.data=req.params.phoneNumber;
					response.userMessage='Authenticated successfully';
					SendResponse(res);		
				}	
				else{
					response.error=true;
					response.data=null;
					response.userMessage='Something went wrong';
					SendResponse(res);			
				}
			});
			
		}
		else{
			response.error=true;
			response.data=null;
			response.userMessage='Authenticated failed';
			SendResponse(res);
		}
	}
	else{
		response.error=true;
		response.data=null;
		response.userMessage='Something went wrong';
		SendResponse(res);
	}
});
/****************************End of Login*****************************/
/*****************************insert card route******************************/
router.route('/insertCard/:phoneNumber/:name/:email/:position/:company/:facebook/:linkedin/:twitter')
.post(function(req,res){
	// User=req.session.User;
	if(req.params.phoneNumber && req.params.phoneNumber.length==10){
		// console.log(User,res.body);
		tables.insertCard(req.params,function(done){
			if(data,done){
				response.error=false;
				response.data=data;
				response.userMessage='Card Created successfully';
				SendResponse(res);		
			}	
			else{
				response.error=true;
				response.data=null;
				response.userMessage='Something went wrong';
				SendResponse(res);			
			}
		});
	}
	else{
		response.error=true;
		response.data=null;
		response.userMessage='Something went wrong';
		SendResponse(res);
	}
});
/****************************End of insert card*****************************/
/*****************************Get cards by userid******************************/
router.route('/getCards/:phoneNumber')
.post(function(req,res){
	console.log('into getCards');
	if(req.params.phoneNumber){
		tables.getCardByUserID(req.params.phoneNumber,function(found,data){
			if(found){
				response.error=false;
			    response.data=data;
			    response.userMessage='get Cards by user successfully';
			    SendResponse(res);
			}
			else{
				response.error=true;
		    	response.data=null;
		    	response.userMessage='User not found';
		    	SendResponse(res);
				
			}
		});
	}
	else{
		response.error=true;
		response.data=null;
		response.userMessage='Something went wrong';
		SendResponse(res);	
	}
	});
	
/********************End of getcards by user***********************************************/
/*****************************Share Cards route******************************/
router.route('/shareCards/:user1/:user2')
.post(function(req,res){
	console.log('into shareCards');
	if(req.params.user1 && req.params.user2 && req.params.user1.length==10 && req.params.user2.length==10){
		tables.shareCards(req.params,function(data,done){
			if(done){
				response.error=false;
			    response.data=data;
			    response.userMessage='Cards shared successfully';
			    SendResponse(res);
			}
			else{
				response.error=true;
		    	response.data=null;
		    	response.userMessage='Something went wrong';
		    	SendResponse(res);
				
			}
		});
	}
	else{
		response.error=true;
		response.data=null;
		response.userMessage='Something went wrong';
		SendResponse(res);	
	}
	});
	
/********************End of Share Cards***********************************************/

/*****************************Generate OTP for user******************************/
router.route('/getOTP/:phoneNumber')
.post(function(req,res){
	console.log('Testing with Android');
	var sent;
	var ses=req.session;
	if(req.params.phoneNumber && req.params.phoneNumber.length==10){
	SMS.send(req.params.phoneNumber,function(done){
		sent=done;
		if(done.sent){
			response.error=false;
	    	var OTP=done.OTP;
	    	User.OTP = done.OTP;
	    	User.phoneNumber = req.params.phoneNumber;
	    	response.data=User;
	    	ses.User = User;
	    	response.userMessage='Message sent successfully';
	    	SendResponse(res);
		}
		else{
			response.error=true;
	    	response.data=null;
	    	response.userMessage='Something went wrong!';
	    	SendResponse(res);
		}
		});
	}
	else{
		response.error=true;
	    	response.data=null;
	    	response.userMessage='Something went wrong!';
	    	SendResponse(res);	
	}
	
});
/********************End of generate OTP user***********************************************/

app.listen(app.get('port'), function() {
	  console.log('SharePro node app is running on port', app.get('port'));
	});
module.exports=app;