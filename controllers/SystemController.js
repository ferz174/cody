
console.log("loading " + module.id);

var mysql = require("mysql");
var cody = require("./../index.js");
var fs = require("fs");
var path = require("path");
var util = require("util");

var mysql = require('mysql');

module.exports = SystemController;

function SystemController(context) {
    var self = this;

  console.log("SystemController.constructor -> page(" + context.page.itemId + ") = " + context.page.title + ", request = " + context.request);

    // init inherited controller
    cody.Controller.call(self, context);
}
SystemController.prototype = Object.create( cody.Controller.prototype );


//fetch config values from database
SystemController.prototype.doRequest = function( finish ) {
  var self = this;
  self.context.fn = "-/cms/system.ejs";

  if (self.isRequest("reload")) {
    self.app.init(function() {
      self.feedback(true, "System reloaded");
      finish();
    });

  } else if (self.isRequest("Save")) {
    self.query("update cody.websites set hostname = "+(cody.config.dbsql == "pg" ? '$1' : '?')+" where id = "+(cody.config.dbsql == "pg" ? '$2' : '?'),
	[this.getParam("hostname"), this.getParam("id")],
	function (err, result) {
      self.doList(function() {
        self.app.init(function() {
          self.feedback(true, "Parameters saved and system reloaded");
          finish();
        });
      });
    });

  } else if (self.isRequest("Hosting")) {
    self.doList(finish);

  } else {
    finish();
  }

};

SystemController.prototype.doList = function(finish) {
  var self = this;

  var hostname = self.context.req.headers.host;
  if (hostname.indexOf(":") >= 0) {
    hostname = (hostname.split(":"))[0];
  }
  //var hostnameA = self.escape("%," + hostname);
  //var hostnameB = self.escape(hostname + ",%");
  //hostname = self.escape(hostname);

  //self.query("SELECT * FROM cody.websites WHERE hostname = " + hostname + " OR hostname LIKE " + hostnameA + " OR hostname LIKE " + hostnameB,
  self.query("select * from cody.websites where hostname = "+(cody.config.dbsql == "pg" ? '$1' : '?')+" or hostname like "+(cody.config.dbsql == "pg" ? '$2' : '?')+" or hostname like "+(cody.config.dbsql == "pg" ? '$3' : '?'),
  [self.escape(hostname), self.escape("%," + hostname) , self.escape(hostname + ",%")],
  function (err, result) {
	result = result.rows ? result.rows : result;
    if (err) throw err;
    if (result.length > 0) {
      //var result = result[0];
      self.context.config = result[0];
      finish(self.formView);
    }
  });
};
