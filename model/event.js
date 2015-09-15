var Sequelize = require('sequelize');
var sequelize = require('../sequelize.js');

module.exports = sequelize.define('events', {

	'name': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	'description': {
		type          : Sequelize.TEXT,
		defaultValue  : '',
		allowNull     : false
	},
	'location': {
		type          : Sequelize.STRING,
		defaultValue  : '',
		allowNull     : false
	},
	'depth': {
		type          : Sequelize.INTEGER,
		defaultValue  : 1,
		allowNull     : false
	},
	'seats': {
		type          : Sequelize.INTEGER,
		defaultValue  : 1,
		allowNull     : false
	},
	
	'when': {
		type          : Sequelize.DATE,
		allowNull     : false
	},
	'image': {
		type          : Sequelize.TEXT,
		defaultValue  : '',
		allowNull     : false
	},
	'data': {
		type          : Sequelize.JSON,
		defaultValue  : {},
		allowNull     : false
	}
	
	
}, { 
	updatedAt: 'updated_at', 
	createdAt: 'created_at'
});
