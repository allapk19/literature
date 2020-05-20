const Deck = require('./deck');
const { ranks, setNames } = require('./constants/constants.js');

function Player(id, name) {
  this.hand = [];
  this.name = name;
  this.id = id;
  this.connected = true;
  this.team = null;
  this.leader = false;
  this.isTurn = false;
  this.availableCards = {};
  this.sets = [];
  this.sockets = [];
}

Player.prototype.addToHand = function addToHand(card) {
  let rank = card.rank;
  let set = card.set;

  let i = 0;

  while (
    i < this.hand.length &&
    setNames.indexOf(set) > setNames.indexOf(this.hand[i].set)
  ) {
    i++;
  }

  while (
    i < this.hand.length &&
    set === this.hand[i].set &&
    ranks.indexOf(rank) > ranks.indexOf(this.hand[i].rank)
  ) {
    i++;
  }
  this.hand.splice(i, 0, card);
};

Player.prototype.removeFromHand = function removeFromHand(card) {
  for (let i = 0; i < this.hand.length; i++) {
    if (this.hand[i].suit === card.suit && this.hand[i].rank === card.rank) {
      this.hand.splice(i, 1);
    }
  }
};

Player.prototype.hasCard = function hasCard(card) {
  for (let i = 0; i < this.hand.length; i++) {
    if (this.hand[i].suit === card.suit && this.hand[i].rank === card.rank) {
      return true;
    }
  }
  return false;
};

Player.prototype.getSets = function getSets() {
  let Sets = new Set();
  this.hand.forEach((card) => {
    Sets.add(card.set);
  });

  return Array.from(Sets);
};

Player.prototype.available = function available(stringSet) {
  const set = Deck.getSet(stringSet);
  let arr = [];

  set.forEach((card) => {
    let index = this.hand.findIndex((element) => {
      return card.equals(element);
    });

    if (index === -1) {
      arr.push(card);
    }
  });

  return arr;
};

Player.prototype.allAvailableCards = function allAvailableCards() {
  let res = {};

  this.sets = this.getSets();

  setNames.forEach((stringSet) => {
    res[stringSet] = this.available(stringSet);
  });

  this.availableCards = res;
};

module.exports = Player;
