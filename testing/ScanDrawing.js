
console.log("loading " + module.id);

var cody = require("../index.js");
var db_scan_table = "scan_drawings"

function ScanDrawing(basis) {
	for (var a in basis)
	{
		if (basis.hasOwnProperty(a)) this[a] = basis[a];
	}
	this.id = this.id || 0;
	this.item = this.item || "";
	this.detect = this.detect || "";
	this.name = this.name || "";
	this.parent = this.parent || "";
	this.scandate = this.scandate || 0;
}

module.exports = ScanDrawing;

ScanDrawing.sqlNewScanDrawing = "insert into "+db_scan_table+" (item) values (?)";
ScanDrawing.sqlGetScanDrawing = "select * from "+db_scan_table+" where ?";
ScanDrawing.sqlSetScanDrawing = "update "+db_scan_table+" set ? where ?";
ScanDrawing.sqlGetScanDrawings = "select item File, item FileName, date_format(scandate,'%d.%m.%Y %H:%i:%s') date from "+db_scan_table+" where scandate > ? and scandate < adddate(?, interval 1 day)";
ScanDrawing.sqlGetScanDrawingsNotName = "select * from "+db_scan_table+" as scantable "+
										"where (? REGEXP scantable.detect or scantable.item = ?) and "+
										"(scantable.name is null or scantable.name='') order by scantable.scandate desc";

//Функции без прототипа
//Вставка новой записи
ScanDrawing.NewScanDrawing = function(controller, data, finish) {
	controller.resetConnection(controller.app).query(ScanDrawing.sqlNewScanDrawing, data, function(error, result) {
		if (error) throw(new Error("ScanDrawing.NewScanDrawing sql error: "+error));
		finish(result.insertId);
    });
};

//Обновление записей из асинхронных функций
ScanDrawing.SetScanDrawing = function(controller, data, id, finish) {
	controller.resetConnection(controller.app).query(ScanDrawing.sqlSetScanDrawing, [data, id], function(error) {
		if (error) throw(new Error("ScanDrawing.SetScanDrawing sql error: "+error));
	});
};

ScanDrawing.SetScanDrawingData = function(controller, data, finish) {
	var store = finish;
	controller.resetConnection(controller.app).query(data, function(error) {
		if (error) throw(new Error("SetScanDrawingData: "+ error));
		store(result);
	});
};

//Получение сканируемого чертежа
ScanDrawing.GetScanDrawing = function(controller, data, finish) {
	var store = finish;
	controller.resetConnection(controller.app).query(ScanDrawing.sqlGetScanDrawing, [data], function(error, result) {
		if (error) throw(new Error("ScanDrawing.GetScanDrawing sql errors: "+error));
		store(result[0] ? new cody.ScanDrawing(result[0]) : false);
	});
};

ScanDrawing.GetScanDrawings = function(controller, data, finish) {
	var store = finish;
	controller.query(ScanDrawing.sqlGetScanDrawings, [data, data], function(error, result) {
		if (error) throw(new Error("ScanDrawing.GetScanDrawings sql errors: "+error));
		var temp = result[0].File;
		store(result);
	});
};

//Получение чертеже которые не перемещены в сводку т.е. поле name null
ScanDrawing.GetScanDrawingsNotName = function(controller, data, finish) {
	var store = finish;
	controller.resetConnection(controller.app).query(ScanDrawing.sqlGetScanDrawingsNotName, [data, data], function(error, result) {
		if (error) {
			throw(new Error("ScanDrawing.GetScanDrawingsNotName sql errors: "+error));
			store([{"false" : error}]);
		}
		store((result.length) ? result : [{"false" : ""}]);
  });
};