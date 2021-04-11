const GameMode = require("../gamemode");
const axios = require("axios");
const GamePlayer = require("../../models/GamePlayer");

class AroundTheWorld extends GameMode {
  constructor(players) {
    super(players);
    this.name = `AroundTheWorld_${this.createdAt.getTime()}`;
  }

  init(players) {}


  // shoot(game_id, secteur, multiplicateur, player) {
  //   var idx = 0;

  //   if (secteur == this.target[idx].sector) {
  //     axios.post(`http://localhost:5000/players/${player.id}`, {
  //       score: score + (secteur * multiplicateur),
  //       remainingShots: remainingShots - 1,
  //     });

  //     gameShot.create({
  //       gameId: game_id,
  //       playerId: player,
  //       multiplicator: multiplicateur,
  //       sector: secteur,
  //     });


  //     return true;
  //   } else {
  //     return false;
  //   }

  //   // return

  //   // if (score - (secteur * multiplicateur)) {

  //   // remainingShots check if 0 currentPlayerId +1
  //   // gamePlayer.update(player, {
  //   //   score: score - secteur * multiplicateur,
  //   //   remainingShots: remainingShots - 1,
  //   // });

  // }


}

module.exports = AroundTheWorld;
