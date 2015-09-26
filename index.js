var express=require("express");
var router = express.Router();
var session=require("express-session");
var SMS = require('./sms');
var multer=require("multer");
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
router.route('/test/data')
.post(function(req,res){
	// console.log(req.body,req.params);
	res.send(req.params);
});
app.post('/login',function(request,response){
	var username=request.body.username;
	var password=request.body.password;
	var ses=request.session;
	 var database=JSON.parse((fs.readFileSync("./database/kvapp.json")).toString());
	
	 for(var i=0;i<database.users.length;i++){
		 if(database.users[i].username==username && database.users[i].password==password)
			 {
			 response.sendFile(__dirname+'/public/new_presentation.html');
				ses.username=username;
				ses.name=database.users[i].firstname+' '+database.users[i].lastname;
				//response.end();
				break;
			 }
	 }
	 if(!ses.username)
		 {
		 response.end('row 0');
		 }
});
router.route('/test/:phoneNumber')
app.post(function(req,res){
	console.log('Testing with Android');
	var sent;
	SMS.send(req.params.phoneNumber,function(done){
		sent=done;
		if(done.sent)
		{
		response.error=false;
    	response.data=data.OTP;
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
	

});
app.listen(app.get('port'), function() {
	  console.log('SharePro node app is running on port', app.get('port'));
	});
