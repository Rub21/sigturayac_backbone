var Recursos = Backbone.Collection.extend({
	model: Recurso,
	url: 'http://localhost:8080/sigturayac/SListarRecurso2',
	parse: function(response) {
		//console.log(response);
		return response;
	}
});


/*var recursos=new Recursos;

recursos.fetch({
	success: function(collection, response) {
		console.log(response);
	}
});*/