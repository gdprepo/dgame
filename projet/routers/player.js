const express = require('express');
const Player = require('../models/Player');

const advancedResults = require('../middleware/advancedResults');

// Define Router
const router = express.Router();

/**
 * @route     GET /players
 * @desc      Get all players
 * @access    Public
 */
router.route('/').get(advancedResults(Player), async (req, res, next) => {
	if (req.header('Accept').includes('application/json'))
		return res.status(200).json(res.advancedResults);

	res.render('players', {
		players: res.advancedResults.data,
	});
});

/**
 * @route			POST /players
 * @desc			Create a new player
 * @access		Public
 */
router.post('/', async (req, res) => {
	const { name, email } = req.body;

	try {
		const newPlayer = new Player({
			name,
			email,
		});

		const player = await newPlayer.save();

		if (req.header('Accept').includes('application/json')) {
			return res.status(201).json(player);
		}

		res.redirect(`http://localhost:5000/players/${player._id}`);
	} catch (err) {
		console.error(err.message);
		res
			.status(500)
			.json({ msg: 'Server Error' })
			.redirect('../views/layout.pug');
	}
});

/**
 * @route			GET /players/new
 * @desc			Get a form to create a player
 * @access		Public
 */
router.get('/new', (req, res) => {
	res.status(406).json({ msg: 'NOT_API_AVAILABLE' });
});

/**
 * @route			GET /players/:id
 * @desc			Get single player
 * @access		Public
 */
router.get('/:id', async (req, res) => {
	try {
		const player = await Player.findById(req.params.id);

		if (!player)
			return res.status(404).json({
				msg: `Player with id ${req.params.id} not found`,
			});

		if (req.header('Accept').includes('application/json')) {
			return res.status(200).json({ player });
		}

		res.redirect(`http://localhost:5000/players/${player._id}/edit`);
	} catch (err) {
		res.status(500).json({ msg: 'Server Error...' });
	}
});

/**
 * @route     GET /players/{id}/edit
 * @desc      Get creation player form
 * @access    Public
 */
router.get('/:id/edit', async (req, res) => {
	try {
		const player = await Player.findById(req.params.id);

		if (!player)
			return res.status(404).json({
				msg: `Player with id ${req.params.id} not found`,
			});

		if (req.header('Accept').includes('application/json'))
			return res.status(406).json({ msg: 'NOT_API_AVAILABLE' });

		res.render('playerEdit', { player });
	} catch (err) {
		res.status(500).json({ msg: 'Server Error...' });
	}
});

/**
 * @route     PATCH /players/{id}
 * @desc      Edit a player
 * @access    Public
 */
router.patch('/:id', async (req, res) => {
	try {
		const { name, email } = req.body;

		const updateFields = {};

		if (name) updateFields.name = name;
		if (email) updateFields.email = email;

		let player = await Player.findById(req.params.id);

		if (!player) return res.status(404).json({ msg: 'Player not found' });

		player = await Player.findByIdAndUpdate(req.params.id, updateFields, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({ player });
	} catch (err) {
		console.error(err.message);
		res.send('Server Error...');
	}
});

/**
 * @route     DELETE /players/{id}
 * @desc      Delete a player
 * @access    Public
 */
router.delete('/:id', async (req, res) => {
	try {
		let player = await Player.findById(req.params.id);

		if (!player) return res.status(404).json({ msg: 'Player not found' });

		await Player.findByIdAndRemove(req.params.id);

		res.status(204).end();
	} catch (err) {
		console.error(err.message);
		res.status(410).send('PLAYER_NOT_DELETABLE');
	}
});

module.exports = router;
