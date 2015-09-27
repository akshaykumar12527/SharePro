var fs = require("fs");
var methods = new Object();
methods.insertUser = function(data,cb){
	try{
		var database=JSON.parse((fs.readFileSync("./database/SharePro.json")).toString());
		var found=false;
		for(var i=0;i<database.users.length;i++){
			if(database.users[i].phoneNumber==data.phoneNumber){
				found=true;
				cb(found,found);
			}
			else if(!found && i==database.users.length-1){
				database.users.push(data);
				fs.writeFileSync("./database/SharePro.json",JSON.stringify(database));
				cb(found,!found);		
			}
		}
		
	}
	catch(Exception){
		console.log(Exception);
		cb(false);
	}

};
methods.insertCard = function(data,cb){
	try{
		var database=JSON.parse((fs.readFileSync("./database/SharePro.json")).toString());
		data.card_id=database.card.length+1;
		database.card.push(data);
		fs.writeFileSync("./database/SharePro.json",JSON.stringify(database));
		cb(data,true);
	}
	catch(Exception){
		console.log(Exception);
		cb(data,false);
	}

};
methods.shareCards = function(data,cb){
	try{
		var database=JSON.parse((fs.readFileSync("./database/SharePro.json")).toString());
		database.friendship.push(data);
		fs.writeFileSync("./database/SharePro.json",JSON.stringify(database));
		cb(data,true);
	}
	catch(Exception){
		console.log(Exception);
		cb(data,false);
	}

};
methods.getContacts=function(data,cb){
	var found=false;
	var database=JSON.parse((fs.readFileSync("./database/SharePro.json")).toString());
	var count = 0;
	 for(var i=0;i<database.friendship.length;i++){
		 if(database.friendship[i].user1==data.user1)
			{
				found = true;
				data.contacts[count] = database.friendship[i].user2;
				count++;
			}
	 }
	cb(found,data);
};
methods.getCardByUserID=function(userid,cb){
	var found=false;
	var database=JSON.parse((fs.readFileSync("./database/SharePro.json")).toString());
	 for(var i=0;i<database.card.length;i++){
		 if(database.card[i].phoneNumber==userid)
			{
				found = true;
				data = database.card[i];
				break;
			}
	 }
	cb(found,data);
};
module.exports = methods;
