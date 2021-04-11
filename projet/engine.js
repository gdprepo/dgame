const AroundTheWorld = require("./engine/gamemodes/around-the-world");

let game = new AroundTheWorld(3);

game._id = "6059b094769387066d3e1eba";

/* game.start([
  {
    id: 1,
    name: "Jean",
    email: "1@test.fr",
    gameWin: 4,
    gameLost: 2,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Paul",
    email: "2@test.fr",
    gameWin: 6,
    gameLost: 3,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Pierre",
    email: "3@test.fr",
    gameWin: 8,
    gameLost: 4,
    createdAt: new Date(),
  },
]); */

// random players

let check = false;

// check = game.shoot(game.players[0], 1, 1, 1);

if (check === true) {
  console.log("SHOOT");
}

// console.log(game);

//game.shoot(game.players[0], game.players[0].score, game.target, index);

// console.log(game);
//console.log(index);

game.randomize(game._id);
