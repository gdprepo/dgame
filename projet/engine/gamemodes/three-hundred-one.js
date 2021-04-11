const GameMode = require("../gamemode");

class ThreeHundredOne extends GameMode {
  constructor(players) {
    super(players);
    this.name = `ThreeHundredOne_${this.createdAt.getTime()}`;
  }

  init(players) {

    
  }

  startGame(id) {
    return GamePlayer.findAll({
      where: {
        gameId: id,
        inGame: true,
      },
      include: [
        {
          model: Player,
        },
      ],
      raw: true,
      nest: true,
    }).then((players) => {
      let player = players.map((p) => p.Player);
      console.log(player);
      let player_id = player.map((p) => p.id);
      console.log(player_id);
      let rand = Math.floor(Math.random() * player_id.length);
      let current_player = player_id[rand];
      console.log("cu : " + current_player);
      return current_player;
    });
  }

}

module.exports = ThreeHundredOne;
