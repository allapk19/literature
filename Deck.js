const { suits, 
        ranks, 
        lowHearts, 
        lowSpades, 
        lowDiamonds, 
        lowClubs, 
        highClubs, 
        highDiamonds, 
        highSpades, 
        highHearts, 
        jokers 
    } = require('./constants/constants.js');

const Card = require('./Card');

function Deck() {
    this.deck = [];
    
    for (let i = 0; i < suits.length; i++) {
        if (suits[i] === 'Joker') {
            this.deck.push(new Card('Red', suits[i]));
            this.deck.push(new Card('Black', suits[i]));
        } else {
            for (let j = 0; j < ranks.length; j++) {
                if (ranks[j] !== 'Red' && ranks[j] !== 'Black') {
                    this.deck.push(new Card(ranks[j], suits[i]));
                }
            }
        }
    }
}

Deck.prototype.shuffle = function shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
}

Deck.prototype.deal = function deal(players) {
    this.shuffle();
    let numPlayers = players.length;
    
    for (let i = 0; i < this.deck.length; i++) {
        players[i % numPlayers].addToHand(this.deck[i]);
    }
    
    for (let i = 0; i< players.length; i++) {
        players[i].allAvailableCards();
    }
}

Deck.getSet = function getSet(set) {

    switch (set) {
        case 'Low Hearts':
            return lowHearts;
        case 'High Hearts':
            return highHearts;
        case 'Low Diamonds':
            return lowDiamonds;
        case 'High Diamonds': 
            return highDiamonds;
        case 'Low Spades':
            return lowSpades;
        case 'High Spades':
            return highSpades;
        case 'Low Clubs':
            return lowClubs;
        case 'High Clubs':
            return highClubs;
        case 'Jokers':
            return jokers;
        default: 
            return [];
    }  
  }

module.exports = Deck;
