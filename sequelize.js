var Sequelize = require('sequelize');

//var url = 'postgres://kvfqksuntzehlc:dwO7w6TE7naBA56bMf55dgNTPV@ec2-54-204-47-70.compute-1.amazonaws.com:5432/d3uoq4q0g7rpeb?ssl=true&sslmode=require';


// Make UTC dates behave...
require('pg').types.setTypeParser(1114, function(value) {
	return new Date(value + 'Z');
});

/*

var sequelize = new Sequelize('dakh54pfbr5h44', 'tngvlsuocnzuzw', 'mShWT2fKPbmoXsG7cDE0PH21Jl', {
	host: 'ec2-50-16-190-77.compute-1.amazonaws.com',
	dialect: 'postgres',
	port:5432,
	protocol: 'postgres',
	//timezone: '+02:00',
	ssl: true,
	native: true
});

*/


var sequelize = new Sequelize('d8t9nbh6ms4ots', 'hxuelvxetavuxg', '96ZcXAQvNDKL-_9L4mbHZ4JPgQ', {
	host: 'ec2-54-204-30-115.compute-1.amazonaws.com',
	dialect: 'postgres',
	port:5432,
	protocol: 'postgres',
	//timezone: '+02:00',
	ssl: true,
	native: true
});



module.exports = sequelize;
