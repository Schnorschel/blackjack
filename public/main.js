let deck = [] // The main card deck
let spentDeck = [] // Cards taken off the main deck are stored here (not used)
let player1Hand = [] // Player 1 hand
let dealerHand = [] // Dealer hand
const show = true // A verbose constant for indicating whether to show or hide a card when being dealt
const hide = false
const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10] // Array for assigning values to each card
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

const qS = e => document.querySelector(e)
const qSA = e => document.querySelectorAll(e)

// Create and populate the data structure (array) that holds the default card deck of 52 cards
const makeDeck = () => {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      // deck.push(ranks[j] + ' of ' + suits[i])
      deck.push({ rank: ranks[j], suit: suits[i], value: values[j] })
    }
  }
}

const removeAllChildren = className => {
  // const container = document.getElementById(className)
  // const elements = document.getElementsByClassName(className)

  // while (elements[0]) {
  //   elements[0].parent.removeChild(elements[0])
  // }
  const e = document.querySelector(className)
  let first = e.firstElementChild
  while (first) {
    first.remove()
    first = e.firstElementChild
  }
}
// const myNode = qS(className)
// let child = myNode.lastElementChild
// while (child) {
//   myNode.removeChild(child)
//   child = myNode.lastElementChild
// }
// while (myNode.firstChild) {
//   myNode.removeChild(myNode.firstChild)
// }
// myNode.querySelectorAll('*').forEach(n => n.remove())
// }

// Display the card deck given in array 'hand' in the console
const showCards = hand => {
  for (let i = 0; i < hand.length; i++) {
    console.log(hand[i].rank + ' of ' + hand[i].suit)
  }
}

// Shuffle the deck given in array 'hand'
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
const getDeckValue = deck => {
  let sum = 0
  for (let i = 0; i < deck.length; i++) {
    sum += deck[i].value
  }
  return sum
}

// Show the total score of cards given in deck in tag className
const showScore = (deck, className) => {
  const score = getDeckValue(deck)
  qS(className).textContent = score
  return score
}

// return the name of the card given in card
const cardName = card => {
  return card.rank + ' of ' + card.suit
}

// Return the path of the corresponding image given the card object in card
const cardImageName = card => {
  // Returns the image file name of a card given its object reference
  // - Deduct the card name given the object 'card'
  // - Convert it to lowercase
  // - Replace all spaces with underscores
  // - Add a '2' at the end, if the rank is a name, because only the
  //   face cards ending in '2' show pictures
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
  // previously: toDeck.push(fromDeck.splice(fromDeck.length - 1, 1)[0])
  toDeck.push(fromDeck.pop())
}

// The final check after dealer plays and display winner/loser message
const checkScore = () => {
  const houseScore = getDeckValue(dealerHand)
  const player1Score = getDeckValue(player1Hand)
  if (houseScore > 21) {
    qS('.message').textContent = 'Dealer loses'
  } else if (player1Score > 21) {
    qS('.message').textContent =
      qS('.message').textContent +
      ' ' +
      qS('.player1Name').textContent +
      ' loses'
  } else if (houseScore > player1Score) {
    qS('.message').textContent = 'Dealer wins'
  } else if (houseScore < player1Score) {
    qS('.message').textContent = qS('.player1Name').textContent + ' wins'
  } else {
    qS('.message').textContent = "It's a tie"
  }
}

// Show top of card in deck in tag className
const layDownTopCard = (deck, className, showHide) => {
  // Depending on boolean argument showHide, show the card back image or not
  // or the actual card image.
  // showHide == true: show image, i.e. image file name is assigned to src attribute
  // showHide == false: show back card image, i.e. image file name is assigned to alt attribute
  // Code for name of cards
  // qS(className).textContent = cardName(
  //   deck[deck.length - 1]
  // )
  // console.log(cardName(deck[deck.length - 1]))
  const cardImg = document.createElement('img')
  if (showHide) {
    cardImg.src = '/images/' + cardImageName(deck[deck.length - 1])
    cardImg.alt = '/images/card_back.svg'
    // cardImg.alt = 'Value: ' + deck[deck.length - 1].value
  } else {
    cardImg.alt = '/images/' + cardImageName(deck[deck.length - 1])
    cardImg.src = '/images/card_back.svg'
  }
  // console.log(className, cardImg.img, cardImg.alt)
  qS(className).appendChild(cardImg)
}

// Disable all buttons with class '.buttonDisablable'
const disableButtons = className => {
  for (let i = 0; i < qSA('.buttonDisablable').length; i++) {
    qSA('.buttonDisablable')[i].disabled = true
  }
}

// Deal a card to Player 1
const dealCardToPlayer1 = () => {
  // console.log('Event: dealCard.click')
  // moveCardFromTo(deck, player1Hand)
  // layDownTopCard(player1Hand, '.cardsOfPlayer1Container', show)
  dealCardToPlayer(deck, player1Hand, '.cardsOfPlayer1Container', show)
  if (showScore(player1Hand, '.player1Score') > 21) {
    flipCards('.cardsOfHouseContainer')
    showScore(dealerHand, '.houseScore')
    qS('.message').textContent = qS('.player1Name').textContent + ' loses'
    disableButtons()
    qS('.footer').style.display = 'flex'
  }
  // showNoOfCards(deck, '.noOfCards')
}

const dealCardToPlayer = (fromDeck, toHand, className, showHide) => {
  moveCardFromTo(fromDeck, toHand)
  layDownTopCard(toHand, className, showHide)
}

// Show the number of cards in deck given HTML tag's className
const showNoOfCards = (deck, className) => {
  qS(className).textContent = deck.length
}

// Run the initial steps, like giving two cards to dealer and (each) player,
// show total card value for player(s) only
const beginGame = () => {
  // Deal to player, dealer, player, dealer
  dealCardToPlayer(deck, player1Hand, '.cardsOfPlayer1Container', show)
  dealCardToPlayer(deck, dealerHand, '.cardsOfHouseContainer', hide)
  dealCardToPlayer(deck, player1Hand, '.cardsOfPlayer1Container', show)
  dealCardToPlayer(deck, dealerHand, '.cardsOfHouseContainer', hide)
  showScore(player1Hand, '.player1Score')
}

// Flip all cards over given the container class in className.
// This is done by swapping the contents of the src and alt attributes.
// The swappable content is the file name of the back card image and the
// file name of the card image.
const flipCards = className => {
  for (let i = 0; i < qS(className).children.length; i++) {
    const temp = qS(className).children[i].alt
    // console.log(temp + ' -> ' + qS(className).children[i].src)
    qS(className).children[i].alt = qS(className).children[i].src
    qS(className).children[i].src = temp
  }
}

// The steps to run after the player holds/stands and the dealer/house
// finishes the game
const housePlays = () => {
  // Show the dealer's cards' faces
  flipCards('.cardsOfHouseContainer')
  // The dealer draws a new card as long as the total value is below 17
  while (showScore(dealerHand, '.houseScore') < 17) {
    dealCardToPlayer(deck, dealerHand, '.cardsOfHouseContainer', show)
  }
  // Check all player's card value totals and display who is winner/loser
  checkScore()
  // Disable the Player's buttons
  disableButtons()
  // show reset button
  qS('.footer').style.display = 'flex'
}

const resetGame = () => {
  // - Refresh deck array and shuffle again
  deck = []
  makeDeck()
  shuffleDeck(deck)
  // - Clean out dealer and player hands
  dealerHand = []
  player1Hand = []
  // - Clean out winner/lose message
  qS('.message').innerHTML = '&nbsp;'
  // - Clean the card scores
  for (i = 0; i < qSA('.playerScore').length; i++) {
    qSA('.playerScore')[i].textContent = ''
  }
  // - Hide reset button
  qS('.footer').style.display = 'none'
  // Re-enable buttons
  for (let i = 0; i < qSA('.buttonDisablable').length; i++) {
    qSA('.buttonDisablable')[i].disabled = false
  }
  // Remove cards from card containers
  removeAllChildren('.cardsOfPlayer1Container')
  removeAllChildren('.cardsOfHouseContainer')

  // Start the game again
  beginGame()
}

const enterPlayer1Name = () => {
  let newName = ''

  while (newName === '') {
    newName = window.prompt('Please enter your name:')
  }
  qS('.player1Name').textContent = newName
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
  //
}

document.addEventListener('DOMContentLoaded', main)
qS('.hitMePlayer1').addEventListener('click', dealCardToPlayer1)
qS('.standPlayer1').addEventListener('click', housePlays)
qS('.reset').addEventListener('click', resetGame)
qS('.player1Name').addEventListener('dblclick', enterPlayer1Name)
