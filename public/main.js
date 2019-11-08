const deck = []
const spentDeck = []
const player1Hand = []
const dealerHand = []
const show = true
const hide = false
const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades']
const ranks = [
  'Ace',
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
  'King'
]

let i, j

// Create the data structure (array) that holds the default card deck of 52 cards
const makeDeck = () => {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      // deck.push(ranks[j] + ' of ' + suits[i])
      deck.push({ rank: ranks[j], suit: suits[i], value: values[j] })
    }
  }
}

// Display the card deck given in hand in the console
const showCards = hand => {
  for (let i = 0; i < hand.length; i++) {
    console.log(hand[i].rank + ' of ' + hand[i].suit)
  }
}

// Shuffle the deck given in hand
const shuffleDeck = hand => {
  let temp
  for (i = hand.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    temp = hand[j]
    hand[j] = hand[i]
    hand[i] = temp
  }
}

// Calculate and return the total value of cards in deck
const calculateDeckValue = deck => {
  let sum = 0
  for (let i = 0; i < deck.length; i++) {
    sum += deck[i].value
  }
  return sum
}

// Show the total score of cards given in deck in tag className
const showScore = (deck, className) => {
  document.querySelector(className).textContent = calculateDeckValue(deck)
}

// return the name of the card given in card
const cardName = card => {
  return card.rank + ' of ' + card.suit
}

// return the path of the corresponding image given the card object in card
const cardImageName = card => {
  // Find the image file name of a card given its array reference
  // - Take the name
  // - Convert it to lowercase
  // - Replace all spaces with underscores
  // - Add a '2' at the end, if the rank is a name, because those show pictures
  return (
    cardName(card)
      .toLowerCase()
      .replace(/ /g, '_') +
    ((!parseInt(card.rank) && card.rank !== 'Ace') ||
    (!parseInt(card.rank) && card.suit === 'Spades')
      ? '2'
      : '') +
    '.svg'
  )
}

// Move the top-most card from fromDeck to toDeck
const moveCardFromTo = (fromDeck, toDeck) => {
  toDeck.push(fromDeck.splice(fromDeck.length - 1, 1)[0])
  // or: toDeck.push(fromDeck.pop())
}

const checkScore = deck => {
  if (calculateDeckValue(dealerHand) > 21) {
    document.querySelector('.message').textContent = 'Dealer loses'
  } else if (calculateDeckValue(player1Hand) > 21) {
    document.querySelector('.message').textContent = 'Player 1 loses'
  }
}

// Show top of card in deck in tag className
const showTopCard = (deck, className, showHide) => {
  // Code for name of cards
  // document.querySelector(className).textContent = cardName(
  //   deck[deck.length - 1]
  // )
  // console.log(cardName(deck[deck.length - 1]))
  const cardImg = document.createElement('img')
  if (showHide) {
    cardImg.src = '/images/' + cardImageName(deck[deck.length - 1])
    cardImg.alt = 'Value: ' + deck[deck.length - 1].value
  } else {
    cardImg.alt = '/images/' + cardImageName(deck[deck.length - 1])
    cardImg.src = '/images/card_back.svg'
  }
  console.log(className, cardImg.img, cardImg.alt)
  document.querySelector(className).appendChild(cardImg)
}

// Deal a card to Player 1
const dealCardToPlayer1 = () => {
  // console.log('Event: dealCard.click')
  moveCardFromTo(deck, player1Hand)
  showTopCard(player1Hand, '.cardsOfPlayer1Container', show)
  showScore(player1Hand, '.player1Score')
  if (calculateDeckValue(player1Hand) > 21) {
    document.querySelector('.message').textContent = 'Player 1 loses'
  }
  // showNoOfCards(deck, '.noOfCards')
}

const dealCardToPlayer = (fromDeck, toHand, className, showHide) => {
  moveCardFromTo(fromDeck, toHand)
  showTopCard(dealerHand, '.cardsOfHouseContainer', showHide)
}

// Show the number of cards in deck in tag className
const showNoOfCards = (deck, className) => {
  document.querySelector(className).textContent = deck.length
}

const beginGame = () => {
  // First two cards go to dealer
  dealCardToPlayer(deck, dealerHand, '.cardsOfHouseContainer', hide)
  dealCardToPlayer(deck, dealerHand, '.cardsOfHouseContainer', hide)
}

const main = () => {
  // if (document.querySelector('h1.hello-world')) {
  //   document.querySelector('h1.hello-world').textContent = 'Hello, World!'
  // }
  console.log('In main')
  makeDeck()
  // showNoOfCards(deck, '.noOfCards')
  console.log('Made deck')
  console.log('Showing cards:')
  showCards(deck)
  console.log()
  console.log('Shuffling cards.')
  shuffleDeck(deck)
  console.log('Showing cards:')
  showCards(deck)
  beginGame()
}

document.addEventListener('DOMContentLoaded', main)
document
  .querySelector('.hitMePlayer1')
  .addEventListener('click', dealCardToPlayer1)
