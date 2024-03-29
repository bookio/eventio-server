var router    = require('express').Router();
var sprintf   = require('../sprintf');
var Server    = require('../server');
var Model     = require('../model');
var Sequelize = require('sequelize')



router.get('/no_category', function (request, response) {

	var server = new Server(request, response);
	
	
	server.authenticate().then(function(session) {

		var query = {
			where: {client_id: session.client_id, category_id:null, available:{ne:0}},
		};

		Model.Rental.findAll(query).then(function(rental) {
		
			server.reply(rental);
			
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


router.post('/generate/:what/:count', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.Rental.count({where: {client_id: session.client_id}}).then(function(count) {
		
			var data = [];
			
			if (count == 0) {
				
				request.params.count = parseInt(request.params.count);
	
				for (var i = 0; i < request.params.count; i++) {
					
					var attributes = {};
					attributes.client_id  = session.client_id;
					attributes.icon_id    = 0;
					attributes.option_ids = [];
					
					if (request.params.count == 1)
						attributes.name = request.params.what;
					else
						attributes.name = sprintf('%s %d', request.params.what, i + 1);

					data.push(attributes);
					
				}
				
			}

			if (data.length > 0) {
				Model.Rental.bulkCreate(data).then(function(result){
					server.reply(result);
					
				}).catch(function(error){
					server.error(error);		
				});
				
			}
			else {
				server.reply([]);
			}

			
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


router.get('/query', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(session) {

		console.log(request.query);

		var begin_at = new Date(request.query.begin_at);
		var end_at = new Date(request.query.end_at);
		var category_id = parseInt(request.query.category_id);
		
		if (isNaN(begin_at.getTime()))
			throw new Error('Need start date.');

		if (isNaN(end_at.getTime()))
			throw new Error('Need end date.');

		var query = '';
		
		query += 'id IN (';
		query += sprintf('SELECT id FROM rentals WHERE client_id=%d ', session.client_id);
		query += sprintf('EXCEPT SELECT rental_id FROM reservations WHERE tsrange(begin_at, end_at) && tsrange(\'%s\'::TIMESTAMP, \'%s\'::TIMESTAMP) AND client_id=%d', begin_at.toISOString(), end_at.toISOString(), session.client_id);
		query += ')';

		if (!isNaN(category_id))
			query += sprintf(' AND category_id=%d', category_id);
		
		var options = {};
		options.where = [ query ]; //Sequelize.and({client_id: session.client_id}, request.body);
			
		Model.Rental.findAll(options).then(function(rentals) {
		
			server.reply(rentals);
		
		}).catch(function(error) {
			server.error(error);
			
		});
		
	}).catch(function(error) {
		server.error(error);
	});	

});


router.get('/', function (request, response) {

	var server = new Server(request, response);
	

	
	server.authenticate().then(function(session) {

		Model.Rental.findAll({where: {client_id: session.client_id}}).then(function(rental) {
		
			console.log(request.body);
			
			server.reply(rental);
			
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});

router.get('/:id', function (request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {
		Model.Rental.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(rental) {
			if (rental == null)
				throw new Error(sprintf('Rental with id %s not found.', request.params.id));
			
			server.reply(rental);
			
		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});



router.post('/', function (request, response) {

	var server = new Server(request, response);
		
	server.authenticate().then(function(session) {

		var rental = Model.Rental.build(request.body);
		
		// Attach it to my client
		rental.client_id = session.client_id;
		
		// Save it
		rental.save().then(function(rental) {
		
			server.reply(rental);
		
		}).catch(function(error) {
			server.error(error);
			
		});
		
	}).catch(function(error) {
		server.error(error);
	});	

});

/*
router.put('/:id', function (request, response) {

	var server = new Server(request, response);

	server.authenticate().then(function(session) {
		Model.Rental.findOne({where: {client_id:session.client_id, id:request.params.id}}).then(function(rental) {
			
			rental.update(request.body).then(function(rental) {
				server.reply(rental);				
			}).catch(function(error){
				server.error(error);
				
			});
				
			
		}).catch(function(error) {
			server.error(sprintf('Update Rental with ID %s failed. %s', request.params.id, error.message));
		});
						
		
	}).catch(function(error) {
		server.error(error);
	});
	

});

*/

router.put('/:id', function (request, response) {

	var server = new Server(request, response);

	server.authenticate().then(function(session) {
		Model.Rental.update(request.body, {returning: true, where: {client_id:session.client_id, id:request.params.id}}).then(function(data) {
			
			if (!data || data.length != 2)
				throw new Error('Invalid results.');

			if (data[0] != 1)
				throw new Error('Rental not found.');
				
			server.reply(data[1][0]);

			
		}).catch(function(error) {
			server.error(sprintf('Update Rental with ID %s failed. %s', request.params.id, error.message));
		});
						
		
	}).catch(function(error) {
		server.error(error);
	});
	

});



router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.Rental.destroy({where: {id:request.params.id}}).then(function(data) {
			server.reply(null);

		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


module.exports = router;

