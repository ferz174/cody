//
// ЧЗМК - 2018
//
//
console.log("loading " + module.id);

var cody = require("./../index.js");


function ScanDrawing(basis) {
  // copy from basis
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }
  this.id = this.id || 0;
  this.name = this.name || 999;
  this.recognize = this.recognize || 0;
  this.scandate = this.scandate || 0;
}

module.exports = ScanDrawing;


//
// Class stuff
//

ScanDrawing.sqlGetScanDrawingList = "select * from scan_drawings";


ScanDrawing.getScanDrawings = function(controller, store) {
  controller.query(ScanDrawing.sqlGetScanDrawingList, function(err, result) {
    if (err) { console.log(err); throw(new Error("ScanDrawing.getUsers failed with sql errors")); }
    store(result);
  });
};


// 
// instance methods
/*

ScanDrawing.prototype.getDomain = function() {
	return this.domain || "";
};

ScanDrawing.prototype.getLevel = function() {
	return this.level || 0;
};

ScanDrawing.prototype.getId = function() {
  return this.id || 0;
};

ScanDrawing.prototype.getSortOrder = function() {
  return this.sortorder || 10;
};

ScanDrawing.prototype.getEmail = function() {
	return this.email || "";
};

ScanDrawing.prototype.isActive = function() {
	return (this.active) ? (this.active === "Y") : false;
};

ScanDrawing.prototype.scrapeFrom = function(controller) {
  this.username = controller.getParam("username", this.username);
  this.password = controller.getParam("password", "");
  this.name = controller.getParam("name", this.name);
  this.domain = controller.getParam("domain", this.domain);
  this.level = controller.getInt("level", this.level);
  this.email = controller.getParam("email", this.email);
  this.note = controller.getParam("note", this.note);
  this.nomail = controller.getParam("nomail", this.nomail);
  this.badlogins = controller.getParam("badlogins", this.badlogins);
  this.maxbadlogins = controller.getParam("maxbadlogins", this.maxbadlogins);
  this.active = controller.getParam("active", this.active);
  this.sortorder = controller.getParam("sortorder", this.sortorder);
};

// not on prototype, no ScanDrawing object exists
ScanDrawing.addBadLogin = function(controller, theUserName, finish) {
  controller.query(ScanDrawing.sqlAddBadLogin, [theUserName], finish);
};

ScanDrawing.prototype.clearBadLogins = function(controller, finish) {
  var self = this;
  
  if (self.badlogins > 0) { 
    controller.query(ScanDrawing.sqlClearBadLogins, [self.username], function(err, result) {
      if (err) { console.log(err); throw(new Error("ScanDrawing.clearBadLogins failed with sql errors")); }
      console.log("Cleared bad logins");
      finish();
    });
  } else { 
    // no need to access the database if there are no badLogins
    finish(); 
  }
};


ScanDrawing.prototype.doUpdate = function(controller, finish) {
  var self = this;
  var values = [self.username, self.name, self.domain, self.level, self.badlogins,
                self.maxbadlogins, self.active, self.email, self.note, self.nomail, self.sortorder];
  
  // new or existing record
  if ((typeof self.id === "undefined") || (self.id === 0)) {

    console.log("insert ScanDrawing " + this.username);
    values.push(self.password);
    controller.query("insert into users (username, name, domain, level, badlogins, maxbadlogins, " +
                     "active, email, note, nomail, sortorder, password) " +
                     "values (?, ?, ?, ?,  ?, ?, ?, ?, ?, ?, ?, password(?))", values,
        function(err, result) {
          if (err) { 
            console.log(err); throw(new Error("ScanDrawing.doUpdate/insert failed with sql errors")); 
          } else {
            self.id = result.insertId;
            console.log("inserted ScanDrawing: " + self.id);
            if (typeof finish === "function") { finish(); }
          }
    });
    
  } else {
    console.log("update ScanDrawing " + self.id + " - " + this.username);
    values.push(self.id);
    controller.query("update users set username = ?, name = ?, domain = ?, level = ?, " +
                     " badlogins = ?, maxbadlogins = ?, active = ?, email = ?, note = ?, nomail = ?, sortorder = ? " +
                     "where id = ?", values,
      function(err) {
        if (err) { 
          console.log(err); throw(new Error("ScanDrawing.doUpdate/update failed with sql errors"));
        } else {
          console.log("updated ScanDrawing: " + self.id);
          if (self.password != "") {
            controller.query("update users set password = password(?) where id = ?", [self.password, self.id], function() {
              if (err) {
                console.log(err); throw(new Error("ScanDrawing.doUpdate/update PW failed with sql errors"));
              }
              console.log("updated password of " + self.id);
              if (typeof finish === "function") {
                finish();
              }
            });
          } else if (typeof finish === "function") {
            finish();
          }
        }
    });
  }
};

ScanDrawing.prototype.doDelete = function(controller, finish) {
  var self = this;
  controller.query(ScanDrawing.sqlDeleteUser, [self.id], function(isOK) {
    if (typeof finish === "function") { finish(isOK); }
  });
};


ScanDrawing.emailExists = function (controller, email, finish) {
 controller.query("SELECT * FROM users WHERE email = ?", [email], function (err, rows) {
   if (err)
     return finish(err);
   finish(undefined, rows.length > 0);
 });
};

ScanDrawing.getByEmail = function (controller, email, finish) {
 controller.query("SELECT * FROM users WHERE email = ?", [email], function (err, rows) {
   if (err) return finish(err);
   if (rows.length > 0) {
     return finish(undefined, new ScanDrawing(rows[0]));
   }
   return finish(undefined, new ScanDrawing());
 });
};
*/

