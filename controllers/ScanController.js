console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("./../index.js");

function ScanController(context) {
	console.log("ScanController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);

    // init inherited Controller
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ScanController CONSTRUCTOR");
    cody.Controller.call(this, context);
}
ScanController.prototype = Object.create(cody.Controller.prototype);


ScanController.prototype.doRequest = function( finish ) {
    var self = this;
	cody.User.getUsers(self, self.getLoginLevel(), function(list) {
		self.context.users = list;
    
		self.doGetRefs(finish);
	});
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ScanController doRequest");


    finish();

};

module.exports = ScanController;