const express = require('express');
const gameRouter = require('./routers/game');
const playerRouter = require('./routers/player');

const router = express.Router();

router.use('/games', gameRouter);
router.use('/players', playerRouter);

module.exports = router;
