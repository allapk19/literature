const Card = require('../Card');

const suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs', 'Joker'];

const ranks = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'Jack',
  'Queen',
  'King',
  'Ace',
  'Red',
  'Black',
];

const setNames = [
  'Low Hearts',
  'High Hearts',
  'Low Diamonds',
  'High Diamonds',
  'Low Spades',
  'High Spades',
  'Low Clubs',
  'High Clubs',
  'Jokers',
];

const setOrder = [
  'Low Spades',
  'Low Diamonds',
  'Low Clubs',
  'Low Hearts',
  'High Spades',
  'High Diamonds',
  'High Clubs',
  'High Hearts',
  'Jokers'
]

const lowHearts = [
  new Card('2', 'Hearts'),
  new Card('3', 'Hearts'),
  new Card('4', 'Hearts'),
  new Card('5', 'Hearts'),
  new Card('6', 'Hearts'),
  new Card('7', 'Hearts'),
];

const highHearts = [
  new Card('9', 'Hearts'),
  new Card('10', 'Hearts'),
  new Card('Jack', 'Hearts'),
  new Card('Queen', 'Hearts'),
  new Card('King', 'Hearts'),
  new Card('Ace', 'Hearts'),
];

const lowDiamonds = [
  new Card('2', 'Diamonds'),
  new Card('3', 'Diamonds'),
  new Card('4', 'Diamonds'),
  new Card('5', 'Diamonds'),
  new Card('6', 'Diamonds'),
  new Card('7', 'Diamonds'),
];

const highDiamonds = [
  new Card('9', 'Diamonds'),
  new Card('10', 'Diamonds'),
  new Card('Jack', 'Diamonds'),
  new Card('Queen', 'Diamonds'),
  new Card('King', 'Diamonds'),
  new Card('Ace', 'Diamonds'),
];

const lowSpades = [
  new Card('2', 'Spades'),
  new Card('3', 'Spades'),
  new Card('4', 'Spades'),
  new Card('5', 'Spades'),
  new Card('6', 'Spades'),
  new Card('7', 'Spades'),
];

const highSpades = [
  new Card('9', 'Spades'),
  new Card('10', 'Spades'),
  new Card('Jack', 'Spades'),
  new Card('Queen', 'Spades'),
  new Card('King', 'Spades'),
  new Card('Ace', 'Spades'),
];

const lowClubs = [
  new Card('2', 'Clubs'),
  new Card('3', 'Clubs'),
  new Card('4', 'Clubs'),
  new Card('5', 'Clubs'),
  new Card('6', 'Clubs'),
  new Card('7', 'Clubs'),
];

const highClubs = [
  new Card('9', 'Clubs'),
  new Card('10', 'Clubs'),
  new Card('Jack', 'Clubs'),
  new Card('Queen', 'Clubs'),
  new Card('King', 'Clubs'),
  new Card('Ace', 'Clubs'),
];

const jokers = [
  new Card('8', 'Hearts'),
  new Card('8', 'Diamonds'),
  new Card('8', 'Spades'),
  new Card('8', 'Clubs'),
  new Card('Red', 'Joker'),
  new Card('Black', 'Joker'),
];

module.exports = {
  suits,
  ranks,
  setNames,
  setOrder,
  lowHearts,
  highHearts,
  lowDiamonds,
  highDiamonds,
  lowSpades,
  highSpades,
  lowClubs,
  highClubs,
  jokers,
};
