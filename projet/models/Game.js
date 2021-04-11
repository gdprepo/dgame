const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
	mode: {
		type: String,
	},
	name: {
		type: String,
	},
	currentPlayerId: {
		type: String,
		default: null,
	},
	status: {
		type: String,
		default: 'draft',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	players: {
		type: [Object],
		default: [],
	},
});

module.exports = mongoose.model('game', GameSchema);
