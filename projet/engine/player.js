class Player {
  constructor(name, email, gameWin = 0, gameLost = 0, createdAt) {
    this.name = name;
    this.email = email;
    this.gameWin = gameWin;
    this.gameLost = gameLost;
    this.nbDart = 3;
    this.score = 0;
    this.createdAt = createdAt;
  }
}

module.exports = Player;
