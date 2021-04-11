const mongoose = require('mongoose');

const GameShotSchema = mongoose.Schema({
	gameId: Number | String,
	playerId: Number | String,
	multiplicator: Number,
	sector: Number,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('gameShot', GameShotSchema);
