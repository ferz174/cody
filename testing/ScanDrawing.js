//
// ЧЗМК - 2018
//
//
console.log("loading " + module.id);

var cody = require("./../index.js");
var name_bd = "constructures";

function ScanDrawing(basis) {
	for (var a in basis) {
		if (basis.hasOwnProperty(a)) {
			this[a] = basis[a];
		}
	}
	this.id = this.id || 0;
	this.item = this.item || "";
	this.detect = this.detect || "";
	this.name = this.name || "";
	this.parent = this.parent || "";
	this.scandate = this.scandate || 0;
}

module.exports = ScanDrawing;

ScanDrawing.sqlGetScanDrawingList = "select * from scan_drawings";
ScanDrawing.sqlGetScanDrawingBy = "select * from "+name_bd+".scan_drawings where ?";
ScanDrawing.sqlUpdateScanDrawingList = "update "+name_bd+".scan_drawings set ? where ?";
ScanDrawing.sqlGetScanDrawingsNotName = "select * from "+name_bd+".scan_drawings as sdrawing "+
										"where (? REGEXP sdrawing.detect or sdrawing.item = ?) and "+
										"(sdrawing.name is null or sdrawing.name='') order by sdrawing.scandate desc";

//Функции без прототипа
//Вставка новой записи
ScanDrawing.doInsert = function(controller, data, finish) { 
	controller.resetConnection(controller.app).
	query("insert into "+name_bd+".scan_drawings (item) values (?)", data,
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

ScanDrawing.doUpdateAsynData = function() {
	var	query_data = arguments[1];
	arguments[0].resetConnection(arguments[0].app).
	query(query_data, function(err) {
		if (err) throw(new Error("doUpdateAsynData: "+ err)); 
	});	
};

//Получение сканируемого чертежа
ScanDrawing.getScanDrawing = function() {	
	var controller = arguments[0];
	var store = arguments[2]; 
	controller.resetConnection(controller.app).query(ScanDrawing.sqlGetScanDrawingBy, [arguments[1]], function(error, results) {
		if (error) { throw(new Error("ScanDrawing.getScanDrawing failed with sql errors")); }
		store(results[0] ? new cody.ScanDrawing(results[0]) : false);		
	});
};

ScanDrawing.getScanDrawingsList = function(controller, store) {
  controller.query(ScanDrawing.sqlGetScanDrawingList, function(err, result) {
    if (err) { throw(new Error("ScanDrawing.getUsers failed with sql errors")); }
    store(result);
  });
};

//Получение чертеже которые не перемещены в сводку т.е. поле name null
ScanDrawing.getScanDrawingsNotName = function(controller, data, finish) {
	var store = finish;
	controller.resetConnection(controller.app).
	query(ScanDrawing.sqlGetScanDrawingsNotName, [data, data], function(err, result) {		
    if (err) { throw(new Error("ScanDrawing.getScanDrawingsNotName sql errors"));  store([{"false" : err}]);}		
	//store((result.length == 1) ? result[0] : {"false" : "Ошибка структуры базы данных обратитесь к разрабочику (length="+result.length+")"});
    store(result);
  });
};






















