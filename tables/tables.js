var fs = require("fs");
var methods = new Object();
methods.insertUser = function(data,cb){

};
methods.getCardByUserID=function(userid,cb){
var found=false;
// var files = fs.readdirSync('./');
//     for (var i in files){
//         var name =  './' + files[i];
//        console.log(files[i]);
//     }
	var database=JSON.parse((fs.readFileSync("./database/SharePro.json")).toString());
	 for(var i=0;i<database.card.length;i++){
		 if(database.card[i].userid==userid)
			{
				found = true;
				break;
			}
	 }
	cb(found);
};
module.exports = methods;
