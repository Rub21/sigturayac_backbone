Mainview = Backbone.View.extend({
	el: 'body',
	template: _.template($('#main_template').html()),
	events: {
		"click #inicio": "inicio",
		"click .btn_detail":"detail"
	},
	initialize: function() {
		_.bindAll(this);

		this.collection = new Recursos();
		this.collection.bind("reset", this.render, this);
		this.collection.fetch();
		this.render();
		//this.drawMap();

	},                
	render: function() {

		$(this.el).html(this.template());
		this.drawMarker(this.collection.toJSON());
		return this;

	},
	detail:function(){
		alert('detaill');
	},
	drawMarker: function(f) {
		var features = f;


		var map_id = 'examples.map-4l7djmvo',
			map = mapbox.map('map');
		map.addLayer(mapbox.layer().id(map_id));
		map.centerzoom({
			lat: -13.16048,
			lon: -74.22565
		}, 15);

		map.setZoomRange(0, 18);
		//console.log('ultimopor aqui' + features);
		markerLayer = mapbox.markers.layer().features(features);
		markerLayer.factory(function(m) {

			//var elem = mapbox.markers.simplestyle_factory(m);
			var elem = simplestyle_factory_rub(m);
			MM.addEvent(elem, 'click', function(e) {
				map.ease.location({
					lat: m.geometry.coordinates[1],
					lon: m.geometry.coordinates[0]
				}).zoom(map.zoom()).optimal();
			});

			return elem;
		});


		interaction = mapbox.markers.interaction(markerLayer);
		map.addLayer(markerLayer);
		map.ui.zoomer.add();
		map.ui.zoombox.add();
		map.ui.hash.add();
		interaction.formatter(function(feature) {
			var o = '<h5 class="popover-geo-title">' + feature.nombre + '</h5>' +
				'<p>' + feature.descripcion.substring(0, 100) + '...</p>' +
				'<div class="well-toltip">' +
				'<img style="height: 120px; width:120px;   margin-right: 3px;" src="' + feature.imagenes[0].url + '">' +
				'<img style="height: 120px; width:120px;" src="' + feature.imagenes[1].url + '">' +
				'</div>';
			var a_button = '';
			var a = feature.clase.replace(/\s/g, "");

			if (a == 'RecursoTurístico') {
				a_button = '<a  role="button" class="btn_detail btn"  href="#detail" conclick="call_detaill_recurso(\'' + feature.idproducto + '\')"> Más Detalle</a>';

			} else if (a == 'Hotel') {
				a_button = '<a  role="button" class="btn"  href="#detail" onclick="call_detail_hotel(\'' + feature.idproducto + '\')"> Más Detalle</a>';

			}
			return o + a_button;
		});
		$('#map').removeClass('loading');

		simplestyle_factory_rub = function(feature) {

			var sizes = {
				small: [20, 50],
				medium: [30, 70],
				large: [35, 90]
			};

			var fp = feature.properties || {};

			var size = fp['marker-size'] || 'medium';	
			var symbol = fp['marker-symbol'];
			var color = fp['marker-color'] || '7e7e7e';
			color = color.replace('#', '');
			var d = document.createElement('img');
			d.width = sizes[size][0];
			d.height = sizes[size][1];
			d.className = 'simplestyle-marker';
			d.alt = fp.title || '';
			d.src = 'http://dl.dropbox.com/u/43116811/icon-tur/' + symbol + '-l.png';
			var ds = d.style;
			ds.position = 'absolute';
			ds.clip = 'rect(auto auto ' + (sizes[size][1] * 0.75) + 'px auto)';
			ds.marginTop = -((sizes[size][1]) / 2) + 'px';
			ds.marginLeft = -(sizes[size][0] / 2) + 'px';
			ds.cursor = 'pointer';
			ds.pointerEvents = 'all';

			return d;
		};

	},

	inicio: function() {
		alert('Inicio');
	}
});



var main = new Mainview();