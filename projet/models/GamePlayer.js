const mongoose = require('mongoose');

const GamePlayerSchema = mongoose.Schema({
	playerId: Number | String,
	gameId: Number | String,
	remainingShots: Number,
	score: Number,
	rank: Number,
	order: Number,
	inGame: Boolean,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('gamePlayer', GamePlayerSchema);
