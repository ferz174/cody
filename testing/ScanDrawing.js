//
// ЧЗМК - 2018
//
//
console.log("loading " + module.id);

var cody = require("./../index.js");

function ScanDrawing(basis) {
  for (var a in basis) {
    if (basis.hasOwnProperty(a)) {
      this[a] = basis[a];
    }
  }
  this.id = this.id || 0;
  this.name = this.name || "name";
  this.recognize = this.recognize || 0;
  this.scandate = this.scandate || 0;
}

module.exports = ScanDrawing;

ScanDrawing.sqlGetScanDrawingList = "select * from scan_drawings";
ScanDrawing.sqlGetScanDrawingBy = "select * from constructures.scan_drawings where ?";
ScanDrawing.sqlUpdateScanDrawingList = "update constructures.scan_drawings set ? where ?";

//Функции без прототипа
//Вставка новой записи
ScanDrawing.doInsert = function(controller, data, finish) { 
	controller.resetConnection(controller.app).
	query("insert into constructures.scan_drawings (name) values (?)", data,
    function(err, result) {
		if (err) throw(new Error("ScanDrawing.doInsert error: "+ err));
		finish(result.insertId);          	 
    }); 
};

//Обновление записей из асинхронных функций
ScanDrawing.doUpdateAsyn = function() {	
	arguments[0].resetConnection(arguments[0].app).
	query(ScanDrawing.sqlUpdateScanDrawingList, [arguments[1], arguments[2]], function(err) {
		if (err) throw(new Error("ScanDrawing.doUpdateAsyn error: "+ err)); 
	});	
};

//Получение сканируемого чертежа
ScanDrawing.getScanDrawing = function() {	
	var controller = arguments[0];
	var store = arguments[2]; 
	controller.resetConnection(controller.app).query(ScanDrawing.sqlGetScanDrawingBy, [arguments[1]], function(error, results) {
		if (error) { console.log(error); throw(new Error("ScanDrawing.getScanDrawing failed with sql errors")); }
		store(results[0] ? new cody.ScanDrawing(results[0]) : false);		
	});
};

ScanDrawing.getScanDrawingsList = function(controller, store) {
  controller.query(ScanDrawing.sqlGetScanDrawingList, function(err, result) {
    if (err) { console.log(err); throw(new Error("ScanDrawing.getUsers failed with sql errors")); }
    store(result);
  });
};






















