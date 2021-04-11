const express = require("express");
const Game = require("../models/Game");
var mongo = require("mongodb");

const advancedResults = require("../middleware/advancedResults");
const GamePlayer = require("../models/GamePlayer");
const GameEngine = require("../engine/gamemode");
const Player = require("../models/Player");
const GameShot = require("../models/GameShot");

var ObjectId = require("mongodb").ObjectID;

const AroundTheWorld = require("../engine/gamemodes/around-the-world");
const Cricket = require("../engine/gamemodes/cricket");
const ThreeHundredOne = require("../engine/gamemodes/three-hundred-one");

let gameEngine = null;
let modeSelect = null;
// Define Router
const router = express.Router();

/**
 * @route     GET /games
 * @desc      Get all users contacts
 * @access    Public
 */
router.route("/").get(advancedResults(Game), async (req, res, next) => {
  if (req.header("Accept").includes("application/json"))
    return res.status(200).json(res.advancedResults);

  res.render("games", {
    games: res.advancedResults.data,
  });
});

// revoyer vers la list des parties creer

/**
 * @route     GET /games/new
 * @desc      New Game
 * @access    Public
 */
router.route("/new").get(advancedResults(Player), async (req, res, next) => {
  // const players = await Player.get();

  res.render("gamesNew", {
    players: res.advancedResults.data,
  });
  return res.status(200);
});

/**
 * @route     POST /games
 * @desc      Create Game
 * @access    Public
 */
router.post("/", async (req, res) => {
  const { name, mode, players } = req.body;

  if (!["around-the-world", "301", "cricket"].includes(mode))
    return res.status(400).json({ msg: "Invalid game mode" });

  try {
    const newGame = new Game({
      name,
      mode,
      players,
    });

    const game = await newGame.save();
    console.log(" OKOK");
    console.log(game);
    console.log(" OKOK");

    res.status(201).json({ game: game._id });
    // res.patch(`/${game._id}`)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error..." });
  }
});

/**
 * @route     GET /games/:id
 * @desc      Get game by id
 * @access    Public
 */
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    const gameplayer = await GamePlayer.find({ gameId: req.params.id });

    if (gameplayer) {
      var index = 0;
      var obj = null;

      var playersIds = [];

      console.log("coucou");
      gameplayer.forEach(async (gplayer) => {
        const p = await Player.findById(gplayer.playerId);
        var name = p.name;
        playersIds.push(p._id.toString());
      });

      console.log("coucou");
    }

    if (!game)
      return res
        .status(404)
        .json({ msg: `Game with id ${req.params.id} not found` });

    if (req.header("Accept").includes("application/json"))
      return res.status(200).json({ game, gameplayer });

    // RANDOM

    if (game.players != []) {
      gameEngine = new GameEngine(game.players);

      // var list = gameEngine.randomize(game._id);

      // const promise1 = Promise.resolve(list);
      // console.log(promise1 + "LIST");

      // var firstId = null;
      // var index = 0;
      // promise1.then(async(value) => {
      //   console.log(value + "LIST");
      //   // expected output: 123
      //   if (index == 0) {
      //     firstId = value.toString()

      //     const updGamecurrentId = await Game.findByIdAndUpdate(
      //       req.params.id,
      //       { $set: { currentPlayerId: firstId } },
      //       { new: true }
      //     )
      //     const save = updGamecurrentId.save();

      //   }
      //   index++
      // });
    }

    // RANDOM

    // game.currentPlayerId = gameEngine.players[0].playerId;

    console.log("gameENgine");
    console.log(game);
    console.log("gameENgine");

    playersIds = gameplayer.map((e) => {
      return e.playerId;
    });

    if (game.mode == "around-the-world") {
      modeSelect = new AroundTheWorld(gameEngine.players);
      // console.log(modeSelect)
      console.log("mode");

      res.render("gameAround.ejs", {
        game: game,
        gameplayer: gameplayer,
        players: playersIds,
        gameEngine: gameEngine,
        modeSelect: modeSelect,
      });
    } else if (game.mode == "cricket") {
      modeSelect = new Cricket(gameEngine.players);

      res.render("gameCricket.ejs", {
        game: game,
        gameplayer: gameplayer,
        players: playersIds,
        gameEngine: gameEngine,
        modeSelect: modeSelect,
      });
    } else if (game.mode == "301") {
      modeSelect = new ThreeHundredOne(gameEngine.players);

      res.render("game301.ejs", {
        game: game,
        gameplayer: gameplayer,
        players: playersIds,
        gameEngine: gameEngine,
        modeSelect: modeSelect,
      });
    }

    return res.status(200);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Server Error..." });
  }
});

/**
 * @route     GET /games/:id/edit
 * @desc      Get edit form
 * @access    Public
 */
router.get("/:id/edit", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game)
      return res.status(404).json({
        msg: `Game with id ${req.params.id} not found`,
      });

    if (req.header("Accept").includes("application/json"))
      return res.status(406).json({ msg: "NOT_API_AVAILABLE" });

    res.render("gameEdit", { game });
  } catch (err) {
    res.status(500).json({ msg: "Server Error..." });
  }
});

/**
 * @route     PATCH /games/:id
 * @desc      Edit single game
 * @access    Public
 */
router.patch("/:id", async (req, res) => {
  try {
    const { name, mode, status, players } = req.body;

    // if (![null, 'draft'].includes(status)) {
    // 	res.status(410).json({ msg: 'GAME_NOT_EDITABLE' });
    // }

    // TODO: Error handler 422 / 422
    const updateFields = {};
    // started

    if (name) updateFields.name = name;
    if (mode) updateFields.mode = mode;
    if (status) updateFields.status = status;
    // if (players) updateFields.players = players;

    // updateFields.players = players;

    let game = await Game.findById({ _id: req.params.id });

    if (!game) return res.status(404).json({ msg: "Game not found" });

    game = await Game.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateFields,
      },
      { new: true }
    );

    let playerGame = [];
    let index = 1;

    players.map(async (e) => {
      const newGameP = new GamePlayer({
        playerId: e,
        gameId: req.params.id,
        remainingShots: 3,
        score: 0,
        rank: null,
        order: index,
        inGame: true,
      });

      index++;

      const newGp = await newGameP.save();
      var o_id = new mongo.ObjectID(e);

      let player = await Player.findById(o_id);
      console.log("player");

      console.log(player);
      console.log("player");

      playerGame.push(player);
    });

    if (game.players != []) {
      gameEngine = new GameEngine(game.players);

      var list = gameEngine.randomize(game._id);

      const promise1 = Promise.resolve(list);
      console.log(promise1 + "LIST");

      var firstId = null;
      var index2 = 0;
      promise1.then(async (value) => {
        console.log(value + "LIST");
        // expected output: 123
        if (index2 == 0) {
          firstId = value.toString();

          const updGamecurrentId = await Game.findByIdAndUpdate(
            req.params.id,
            { $set: { currentPlayerId: firstId } },
            { new: true }
          );
          const save = updGamecurrentId.save();
        }
        index2++;
      });
    }

    res.send({
      games: game,
    });

    return res.status(200);

    // let index = 0;
    // gameEngine.players.( async (e) => {
    //   console.log(e.createdAt);

    //   const newGameP = new GamePlayer({
    //     playerId: e._id,
    //     gameId: game._id,
    //     remainingShots: 3,
    //     score: 0,
    //     rank: index,
    //     order: 0,
    //     inGame: true,
    //   });

    //   const gameP = await newGameP.save().then(() => {
    // 	console.log("okok");
    //   }).catch((error) => {
    // 	  console.log("error")
    //   })

    //   index++;
    // });

    // res.status(200).json({ game });
  } catch (err) {
    console.error(err.message);
    res.send("Server Error...");
  }
});

/**
 * @route     DELETE /games/:id
 * @desc      Delete game
 * @access    Public
 */
router.delete("/:id", async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);

    if (!game) return res.status(404).json({ msg: "Game not found" });

    await Game.findByIdAndRemove(req.params.id);

    res.status(204).end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error...");
  }
});

/**
 * @route     GET /games/:id
 * @desc      Get players in a game
 * @access    Public
 */
router.get("/:id/players", (req, res) => {
  try {
    const game = Game.findById(req.params.id);

    if (!game) return res.status(404).json({ msg: "Game not found" });

    res.status(200).json({ players: game.players });
  } catch (err) {
    console.error(err.message);
    res.send("Server Error...");
  }
});

/**
 * @route     POST /games/{id}
 * @desc      Get all users contacts
 * @access    Public
 */
router.post("/:id/players", async (req, res) => {
  const { players } = req.body;

  try {
    let game = Game.findById(req.params.id);

    if (!game) return res.status(404).json({ msg: "Game not found" });

    game = await Game.findByIdAndUpdate(
      req.params.id,
      {
        $set: { players },
      },
      { new: true }
    );

    // res.status(200).end();
    res.redirect(303, `/games/${req.params}`);
  } catch (err) {
    console.error(err.message);
    res.send("Server Error...");
  }
});

/**
 * @route     DELETE /games/{id}/players
 * @desc      Get all users contacts
 * @access    Public
 */
router.delete("/:id/players", (req, res) => {
  res.status(400).json({ msg: "Get Games" });
});

/**
 * @route     POST /games/{id}/players
 * @desc      Get all users contacts
 * @access    Public
 */
router.post("/:id/shots", async (req, res) => {
  //req.params.id
  const { playerId, secteur } = req.body;

  const gamePlayer = await GamePlayer.findOne({
    gameId: req.params.id,
    playerId: playerId,
  });

  const score = gamePlayer.score + 1

  var check = gameEngine.shoot(secteur, score);

  console.log("CHECK=" + check);

  const gameP = await GamePlayer.find({ gameId: req.params.id });

  playersIds = gameP.map((e) => {
    return e.playerId;
  });

  console.log('ENGINE= '+ gameEngine.players )

  if (check != false) {
    console.log(" data!");

    if (gamePlayer.remainingShots > 0) {
      const gameshot = new GameShot({
        gameId: req.params.id,
        playerId: playerId,
        multiplicator: 1,
        sector: secteur,
      });

      const saveShot = await gameshot.save();

      const gameP = await GamePlayer.findOneAndUpdate(
        { gameId: req.params.id, playerId: playerId },
        {
          $set: {
            score: gamePlayer.score + 1,
            remainingShots: gamePlayer.remainingShots - 1,
          },
        },
        {
          new: true,
        }
      );
      message = "CIBLE TOUCHE";

      console.log('PlayerIDS= ' +playersIds)

      if (gamePlayer.remainingShots == 1) {
        message = "TOUCHE NEXT";
        var id = null;
        var check = false;

        playersIds.forEach((e) => {
          if (check == true) {
            id = e;
          }
          if (e == playerId) {
            check = true;
          }

        });

        if (id == null) {
          id = playerIds[0]
        }

      console.log('ID new= ' +id)


      const updGamecurrentId = await Game.findByIdAndUpdate(
        req.params.id,
        { $set: { currentPlayerId: id } },
        { new: true }
      );
      const save = updGamecurrentId.save();

      }
    } else {
      var message = "Vous n'avez plus de fleches";
    }

    if (gamePlayer.remainingShots == 0) {
      var message = "NEXT";
    }

    console.log(" data!");

  } else {
    const gamePlayer = await GamePlayer.findOne({
      gameId: req.params.id,
      playerId: playerId,
    });

    if (gamePlayer.remainingShots > 1) {
      const gameshot = new GameShot({
        gameId: req.params.id,
        playerId: playerId,
        multiplicator: 1,
        sector: secteur,
      });

      const saveShot = await gameshot.save();

      const gameP = await GamePlayer.findOneAndUpdate(
        { gameId: req.params.id, playerId: playerId },
        {
          $set: {
            remainingShots: gamePlayer.remainingShots - 1,
          },
        },
        {
          new: true,
        }
      );
      message = "CIBLE RATE";
    } else {
      var message = "Vous n'avez plus de fleches";
    }

    if (gamePlayer.remainingShots == 0) {
      var message = "NEXT PLAYER";
    }
  }

  res.send({
    message: message,
  });

  //  res.status(200).json({ msg: "Get Games" });
  return res.status(200);
});

/**
 * @route     DELETE /games/{id}/players/previous
 * @desc      Get all users contacts
 * @access    Public
 */
router.post("/:id/shots/previous", (req, res) => {
  res.status(400).json({ msg: "Get Games" });
});

/**
 * @route     DELETE /games/{id}
 * @desc      Delete Game by id
 * @access    Public
 */
router.delete("/:id", (req, res) => {
  res.status(204).json({ msg: "Delete Game" });
});

module.exports = router;
