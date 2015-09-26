var express=require("express");
var router = express.Router();
var session=require("express-session");
var SMS = require('./sms');
var tables = require('./tables/tables');
var multer=require("multer");
var OTP;
var bodyParser=require('body-parser');
var app=express();
var fs = require("fs");
var slide_files=[];
app.set('port', (process.env.PORT || 8000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'ssshhhhh'}));
// app.use('/api',router);
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
app.use('/',router);
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
			response.error=false;
			response.data=req.params.phoneNumber;
			response.userMessage='Authenticated successfully';
			SendResponse(res);
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
/*****************************End of Login******************************/
/*****************************Get cards by userid******************************/
router.route('/getCards/:phoneNumber')
.post(function(req,res){
	console.log('into getCards');
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
	
	});
	
/********************End of getcards by user***********************************************/


/*****************************Generate OTP for user******************************/
router.route('/getOTP/:phoneNumber')
.post(function(req,res){
	console.log('Testing with Android');
	var sent;
	var ses=req.session;
	SMS.send(req.params.phoneNumber,function(done){
		sent=done;
		if(done.sent)
		{
		response.error=false;
    	var OTP=done.OTP;
    	User.OTP = done.OTP;
    	User.phoneNumber = req.params.phoneNumber;
    	response.data=User;
    	ses.User = User;
    	response.userMessage='Message sent successfully';
    	SendResponse(res);
		}
		else
		{
		response.error=true;
    	response.data=null;
    	response.userMessage='Something went wrong!';
    	SendResponse(res);
		}
	});
	
/********************End of generate OTP user***********************************************/
});
app.listen(app.get('port'), function() {
	  console.log('SharePro node app is running on port', app.get('port'));
	});
