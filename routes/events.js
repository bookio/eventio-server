var router    = require('express').Router();
var sprintf   = require('../sprintf');
var Server    = require('../server');
var Model     = require('../model');
var Sequelize = require('sequelize')


router.get('/', function (request, response) {

	var server = new Server(request, response);
	

	
	server.authenticate().then(function(session) {

		Model.Event.findAll({where: {client_id: session.client_id}}).then(function(event) {
		
			console.log(request.body);
			
			server.reply(event);
			
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
		Model.Event.findOne({where: {client_id: session.client_id, id:request.params.id}}).then(function(event) {
			if (event == null)
				throw new Error(sprintf('Event with id %s not found.', request.params.id));
			
			server.reply(event);
			
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

		var event = Model.Event.build(request.body);
		
		// Attach it to my client
		event.client_id = session.client_id;
		
		// Save it
		event.save().then(function(event) {
		
			server.reply(event);
		
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
		Model.Event.findOne({where: {client_id:session.client_id, id:request.params.id}}).then(function(rental) {
			
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
		Model.Event.update(request.body, {returning: true, where: {client_id:session.client_id, id:request.params.id}}).then(function(data) {
			
			if (!data || data.length != 2)
				throw new Error('Invalid results.');

			if (data[0] != 1)
				throw new Error('Event not found.');
				
			server.reply(data[1][0]);

			
		}).catch(function(error) {
			server.error(sprintf('Update Event with ID %s failed. %s', request.params.id, error.message));
		});
						
		
	}).catch(function(error) {
		server.error(error);
	});
	

});



router.delete('/:id', function(request, response) {

	var server = new Server(request, response);
	
	server.authenticate().then(function(session) {

		Model.Event.destroy({where: {id:request.params.id}}).then(function(data) {
			server.reply(null);

		}).catch(function(error) {
			server.error(error);
		});
		
	}).catch(function(error) {
		server.error(error);
	});
	
});


module.exports = router;

