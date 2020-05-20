const Player = require('./player');
const Deck = require('./deck');
const Card = require('./card');

function Game(code) {
  this.code = code;
  this.players = [];
  this.playerMap = new Map();
  this.scoreTeam1 = 0;
  this.scoreTeam2 = 0;
  this.started = false;
  this.declaredSetsTeam1 = [];
  this.declaredSetsTeam2 = [];
  this.log = "Let's start the game!";
  this.declareMessage = "";
  this.deck = new Deck();
}

Game.prototype.start = function start() {
  this.clear();
  this.started = true;
  this.deck.deal(this.players);
  this.players[0].isTurn = true;
};

Game.prototype.clear = function clear() {
  for (let i = 0; i < this.players.length; i++) {
    this.players[i].hand = [];
    this.players[i].turn = false;
  }
  this.scoreTeam1 = 0;
  this.scoreTeam2 = 0;
  this.declaredSetsTeam1 = [];
  this.declaredSetsTeam2 = [];
  this.log = "Let's start the game!";
  this.deck = new Deck();
};

Game.prototype.addPlayer = function addPlayer(id, name) {
  for (let i = 0; i < this.players.length; i++) {
    if (this.players[i].id === id) {
      return { error: 'You have already joined this game' };
    }
    if (this.players[i].name === name) {
      if (this.players[i].connected === false) {
        this.players[i].connected = true;
        console.log(name + ' reconnected');
        return { player: this.players[i] };
      }
      return { error: 'There is already a player with this name' };
    }
  }
  let player = new Player(id, name);
  this.players.push(player);
  this.playerMap.set(name, player);
  if (this.players.length === 1) {
    this.players[0].leader = true;
  }
  return { player: player };
};

Game.prototype.removePlayer = function removePlayer(name) {
  for (let i = 0; i < this.players.length; i++) {
    if (this.players[i].name === name) {
      this.players.splice(i, 1);

      // if the removed player was the leader, reassign leader
      if (this.playerMap.get(name).leader === true) {
        if (this.players.length > 0) {
          this.players[0].leader = true;
        }
      }
      this.playerMap.delete(name);
    }
  }
};

Game.prototype.ask = function ask(sourcePlayerName, targetPlayerName, card) {
  let sourcePlayer = this.playerMap.get(sourcePlayerName);
  let targetPlayer = this.playerMap.get(targetPlayerName);
  if (
    sourcePlayer.isTurn &&
    sourcePlayer.hand.length > 0 &&
    targetPlayer.hand.length > 0
  ) {
    if (targetPlayer.hasCard(card)) {
      targetPlayer.removeFromHand(card);
      sourcePlayer.addToHand(card);
      this.log = `<span style="color: #1890FF">${sourcePlayerName}</span> took the ${Card.toString(
        card
      )} from <span style="color: #1890FF">${targetPlayerName}</span>`;
      sourcePlayer.allAvailableCards();
      targetPlayer.allAvailableCards();
      return true;
    } else {
      sourcePlayer.isTurn = false;
      targetPlayer.isTurn = true;
      this.log = `<span style="color: #1890FF">${sourcePlayerName}</span> asked for the ${Card.toString(
        card
      )} from <span style="color: #1890FF">${targetPlayerName}</span>`;
      sourcePlayer.allAvailableCards();
      targetPlayer.allAvailableCards();
      return false;
    }
  }
};

Game.prototype.declare = function declare(playerName, cards, set) {
  let player = this.playerMap.get(playerName);
  if (player.isTurn && player.hand.length > 0) {
    for (let i = 0; i < cards.length; i++) {
      if (!this.playerMap.get(cards[i].player).hasCard(cards[i].card)) {
        // incorrect declare
        if (player.team === 1) {
          this.scoreTeam2++;
          this.declaredSetsTeam2.push(set);
        } else {
          this.scoreTeam1++;
          this.declaredSetsTeam1.push(set);
        }

        this.declareMessage = `${playerName} incorrectly declared the ${set}`;
        this.deleteCards(set);
        this.checkTeamNoCards(player);
        return false;
      }
    }
    // correct declare
    if (player.team === 1) {
      this.scoreTeam1++;
      this.declaredSetsTeam1.push(set);
    } else {
      this.scoreTeam2++;
      this.declaredSetsTeam2.push(set);
    }

    this.declareMessage = `${playerName} correctly declared the ${set}`;
    this.deleteCards(set);
    this.checkTeamNoCards(player);
    return true;
  }
};

Game.prototype.checkTeamNoCards = function checkTeamNoCards(player) {
  let transfer = true;
  let otherTeamPlayers = [];
  for (let i = 0; i < this.players.length; i++) {
    if (this.players[i].team === player.team) {
      if (this.players[i].hand.length !== 0) {
        transfer = false;
      }
    } else {
      otherTeamPlayers.push(this.players[i]);
    }
  }
  if (transfer) {
    player.isTurn = false;
    for (let i = 0; i < otherTeamPlayers.length; i++) {
      otherTeamPlayers[i].isTurn = true;
    }
  }
};

Game.prototype.deleteCards = function deleteCards(set) {
  let setArray = Deck.getSet(set);
  for (let i = 0; i < setArray.length; i++) {
    for (let j = 0; j < this.players.length; j++) {
      if (this.players[j].hasCard(setArray[i])) {
        this.players[j].removeFromHand(setArray[i]);
        break;
      }
    }
  }
  for (let i = 0; i < this.players.length; i++) {
    this.players[i].allAvailableCards();
  }
};

Game.prototype.transfer = function transfer(
  sourcePlayerName,
  targetPlayerName
) {
  let sourcePlayer = this.playerMap.get(sourcePlayerName);
  let targetPlayer = this.playerMap.get(targetPlayerName);
  if (sourcePlayer.isTurn) {
    sourcePlayer.isTurn = false;
    targetPlayer.isTurn = true;
  }
};

module.exports = Game;
