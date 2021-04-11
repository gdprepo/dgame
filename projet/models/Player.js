const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	gameWin: {
		type: Number,
		default: 0,
	},
	gameLost: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('player', PlayerSchema);
