var express=require("express");
var router = express.Router();
var session=require("express-session");
var SMS = require('./sms');
var multer=require("multer");
var bodyParser=require('body-parser');
var app=express();
var handle=require("./handlers");
var unzip=require("unzip2");
var cloudconvert = new (require('cloudconvert'))('fyBicM0wsFpuSInEngnHMkCIIGgmO3bzAXshgPZPztOXSnP0RYigUe-39cUjpMmmmvr_ZaB-I75paFF4FlTbJQ');
var port=8000;
var fs = require("fs");
var file_path=false;
var file_name=false;
var done=false;
var slide_files=[];
app.set('port', (process.env.PORT || 8000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'ssshhhhh'}));
// app.use('/api',router);
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
app.use(express.static(__dirname+"/public"));
app.get('/',function(req,res){
	console.log(req.url);
	res.sendFile(__dirname+'/public/signup.html');
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
// router.route('/test/:phoneNumber')
app.post('/test/:phoneNumber/:OTP',function(req,res){
	console.log('Testing with Android');
	// console.log(SMS.send)
	console.log(req.params.phoneNumber)
	
	console.log(req.body.phoneNumber);
	var sent;
	SMS.send(req.params.phoneNumber,function(done){

		console.log(done);
		sent=done;
		if(done)
		res.json({'sent':sent});
		else
		console.log('Something went wrong');
	},req.params.OTP);
	

});
app.post('/validateusername',function(req,res){
	var result={
			  "valid" : false,
			  "message" : "Username is already exist"
			};
	var username=req.body.username;
	var database=JSON.parse((fs.readFileSync("./database/kvapp.json")).toString());
	
	 for(var i=0;i<database.users.length;i++){
		 if(database.users[i].username==username)
			 {
			 result.valid=true;
				break;
			 }
	 }
	 result.valid?result.valid=false:result.valid=true;
	res.send(result);
	res.end();
});
app.post('/getsession',function(request,response){
	response.send(request.session);
	response.end();
});
app.post('/syncvideowithslides',function(req,res){
	var postData = '';
	console.log(req.url);
	req.setEncoding('utf8');

	req.addListener('data', function(postDataChunk) {
	    postData += postDataChunk;
	});

	req.addListener('end', function() {
	   console.log(postData);
	   var ses=req.session;
		var database=JSON.parse((fs.readFileSync("./database/kvapp.json")).toString());
		handle.insertData(database,postData,ses.username,res);
	});
	
});
app.get("/getSlide_Data",function(req,res){
	var video_id=req.url.split('=').pop();
	console.log(video_id);
	var slide_data={};
	var database=JSON.parse((fs.readFileSync("./database/kvapp.json")).toString());
	for(var i=0;i<database.video.length;i++){
		if(database.video[i].video_id==video_id){
			slide_data.video=database.video[i];
			break;
		}
	}
	var slides=[];
	for(var i=0;i<database.slides.length;i++){
		if(database.slides[i].video_id==video_id)
			{
			slides.push(database.slides[i]);
			}
	}
	slide_data.slides=slides;
	res.send(slide_data);
	res.end();
//	var connection=db.createConnection();
//	connection.connect();
//	connection.query("select * from video where video_id="+video_id,function(error,row){
//		if(!error){
//			var video=row[0];
//			connection.query("select * from slides where video_id="+video_id,function(err,row2){
//				var slides=row2;
//				var slide_data={'video':video,'slides':slides};
//				res.send(slide_data);
//				res.end();
//			});
//			
//		}
//		else
//			{
//			res.end('error'+error);
//			}
//	});
	
});
app.listen(app.get('port'), function() {
	  console.log('KVApp node app is running on port', app.get('port'));
	});
