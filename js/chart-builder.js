$(document).ready(function() {
	get_csv();
});
window.grid;

var get_csv = function() {
	$.get("wb-india.csv", function(data) {
		data = CSVToArray(data);
		show_in_grid(data);
		set_column_selects();
		$(window).trigger("resize");
		show_chart();
		
	});
};

var show_in_grid = function(data) {
	var columns = [];
	
	for(var i=0, j=data[0].length; i < j; i++) {
		var d = data[0][i];
		var v = d.toLowerCase().replace(/ /g, "_");
		columns.push({
			id: v, name: d, field: v
		})
	}
	
	var objlist = [];
	for(var ri=1, rlen=data.length; ri < rlen; ri++) {
		var row = {};
		for(var ci=0, clen=data[ri].length; ci < clen; ci++) {
			row[columns[ci].field] = data[ri][ci];
		}
		objlist.push(row);
	}
	

	var options = {
	  enableCellNavigation: true,
	  enableColumnReorder: false
	};
	
    window.grid = new Slick.Grid("#slickgrid", objlist, columns, options);
	
}

var set_column_selects = function() {
	window.start_column = $("#start-column");
	window.end_column = $("#end-column");
	$.each(grid.getColumns(), function(i, v) {
		window.start_column.append('<option value="'+ i +'">'+v.name+'</option>');
	});
	window.end_column.html(window.start_column.html());
}

var show_chart = function() {
	if(!grid) return;
	var columns = $.map(grid.getColumns(), function(v, i) { 
		return (i >= window.start_column.val() && i<=window.end_column.val()) ? v.name : null;
	});
	var data = grid.getData();
	var row = [];
	for(var i=0, l=columns.length; i<l; i++) {
		row.push(parseFloat(data[0][columns[i]] || 0));
	}
	
	var opts = {
		labels : columns,
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data : row
			},
		]
	};
	
	console.log(opts);
	var ctx = document.getElementById("chart").getContext("2d");
	var myNewChart = new Chart(ctx).Line(opts);
	
}

$(window).on("resize", function() {
	var $canvas = $("canvas");
	$canvas.attr("width", $canvas.parent().width());
	show_chart();
});

var get_modal = function(content) {
	var modal = $('<div class="modal" style="overflow: auto;" tabindex="-1">\
		<div class="modal-dialog">\
			<div class="modal-content">\
				<div class="modal-header">\
					<a type="button" class="close"\
						data-dismiss="modal" aria-hidden="true">&times;</a>\
					<h4 class="modal-title">Edit HTML</h4>\
				</div>\
				<div class="modal-body ui-front">\
					<textarea class="form-control" \
						style="min-height: 200px; margin-bottom: 10px;\
						font-family: Monaco, Fixed">'+content+'</textarea>\
					<button class="btn btn-success">Update</button>\
				</div>\
			</div>\
		</div>\
		</div>').appendTo(document.body);
		
	return modal;
};
