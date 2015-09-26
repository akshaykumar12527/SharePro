var methods = new Object();
methods.insertUser = function(data,cb){

};
methods.getCardByUserID=function(userid,cb){
var found=false;
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
