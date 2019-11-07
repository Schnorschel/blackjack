const deck = []
const spentDeck = []
const player1Hand = []
const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades']
const ranks = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Jack',
  'Queen',
  'King'
]

let i, j

const makeDeck = () => {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      // deck.push(ranks[j] + ' of ' + suits[i])
      deck.push({ rank: ranks[j], suit: suits[i], value: values[j] })
    }
  }
}

const showCards = hand => {
  for (let i = 0; i < hand.length; i++) {
    console.log(hand[i].rank + ' of ' + hand[i].suit)
  }
}

const shuffleDeck = hand => {
  let temp
  for (i = hand.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    temp = hand[j]
    hand[j] = hand[i]
    hand[i] = temp
  }
}

const cardName = card => {
  return card.rank + ' of ' + card.suit
}

const cardImageName = card => {
  return (
    cardName(card)
      .toLowerCase()
      .replace(/ /g, '_') + '.svg'
  )
}

const moveCardFromTo = (fromDeck, toDeck) => {
  toDeck.push(fromDeck.splice(fromDeck.length - 1, 1)[0])
  // or: toDeck.push(fromDeck.pop())
}

const dealCard = () => {
  // console.log('Event: dealCard.click')
  moveCardFromTo(deck, spentDeck)
  showTopCard(spentDeck, '.lastDealtCardFromDeck')
  showNoOfCards(deck, '.noOfCards')
}

const showNoOfCards = (deck, className) => {
  document.querySelector(className).textContent = deck.length
}

const showTopCard = (deck, className) => {
  document.querySelector(className).textContent = cardName(
    deck[deck.length - 1]
  )
  console.log(cardName(deck[deck.length - 1]))
}

const main = () => {
  // if (document.querySelector('h1.hello-world')) {
  //   document.querySelector('h1.hello-world').textContent = 'Hello, World!'
  // }
  console.log('In main')
  makeDeck()
  showNoOfCards(deck, '.noOfCards')
  console.log('Made deck')
  console.log('Showing cards:')
  showCards(deck)
  console.log()
  console.log('Shuffling cards.')
  shuffleDeck(deck)
  console.log('Showing cards:')
  showCards(deck)
}

document.addEventListener('DOMContentLoaded', main)
document.querySelector('.dealCard').addEventListener('click', dealCard)
