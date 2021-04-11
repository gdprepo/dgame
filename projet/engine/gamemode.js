const Player = require("./player");
const axios = require("axios");
const GameShot = require("../models/GameShot");
const GamePlayer = require("../models/GamePlayer");
var ObjectId = require('mongodb').ObjectID;

class GameMode {
  constructor(players) {
    this.name = "";
    this.players = players;
    this.nbPlayers = players.length;
    this.target = [
      { sector: 1, multiplicators: [1, 2, 3] },
      { sector: 2, multiplicators: [1, 2, 3] },
      { sector: 3, multiplicators: [1, 2, 3] },
      { sector: 4, multiplicators: [1, 2, 3] },
      { sector: 5, multiplicators: [1, 2, 3] },
      { sector: 6, multiplicators: [1, 2, 3] },
      { sector: 7, multiplicators: [1, 2, 3] },
      { sector: 8, multiplicators: [1, 2, 3] },
      { sector: 9, multiplicators: [1, 2, 3] },
      { sector: 10, multiplicators: [1, 2, 3] },
      { sector: 11, multiplicators: [1, 2, 3] },
      { sector: 12, multiplicators: [1, 2, 3] },
      { sector: 13, multiplicators: [1, 2, 3] },
      { sector: 14, multiplicators: [1, 2, 3] },
      { sector: 15, multiplicators: [1, 2, 3] },
      { sector: 16, multiplicators: [1, 2, 3] },
      { sector: 17, multiplicators: [1, 2, 3] },
      { sector: 18, multiplicators: [1, 2, 3] },
      { sector: 19, multiplicators: [1, 2, 3] },
      { sector: 20, multiplicators: [1, 2, 3] },
      { sector: "center", multiplicators: [1, 2] }, // 25
    ];
    this.createdAt = new Date();
    this.nbDart = 3;
  }


  // setGPmode(mode) {

  // }

  getNbPlayers(input) {
    this.nbPlayers = input;
    console.log("Gamemode nombre de joueurs : " + this.nbPlayers);
    return this.nbPlayers;
  }

  /**
   * @param {Array} players Liste des joueurs venant de la requête GET /players de l'API
   */
  start(players) {
    players.map((p) =>
      this.players.push(
        new Player(p.name, p.email, p.gameWin, p.gameLost, p.createdAt)
      )
    );
  }

  init() {
    console.log("Bienvenue, Game Initialisé");
  }

  shoot(secteur, cible) {
    var idx = 0;
    console.log(parseInt(secteur));

    if (parseInt(secteur) != parseInt(cible)) {
      // axios.post(`http://localhost:5000/players/${player.id}`, {
      //   score: this + (secteur * multiplicateur),
      //   remainingShots: this - 1,
      // });
      return false;

    } else {
      return true;

    }

    // return

    // if (score - (secteur * multiplicateur)) {

    // remainingShots check if 0 currentPlayerId +1
    // gamePlayer.update(player, {
    //   score: score - secteur * multiplicateur,
    //   remainingShots: remainingShots - 1,
    // });
  }
  

  randomize(gameId) {
    let result = null;

    result = axios
      .get(`http://localhost:5000/games/${gameId}`)
      .then((res) => {
        const { data } = res;
        let gameplayer = data.gameplayer;
        let ids = [];
        let arr = [];


        gameplayer.map((e) => {
          ids.push(e.playerId.toString())
        })

        console.log(ids + "IDSSS")

        const newPlayersOrder = ids.sort(() => Math.random() - 0.5);

        arr = [...newPlayersOrder]

        console.log(newPlayersOrder[0] + "random");

        return arr[0]

      })
      .catch((err) => console.log(err.message));


      return result
  }
}

module.exports = GameMode;
