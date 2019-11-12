// Blackjack by Georg Oehl (oeh@pobox.com)
// for end-of-week-two (JavaScript) assignment
// at Suncoast Developers Guild (SDG)

let deck = [] // The main card deck
let player1Hand = [] // Player 1 hand
let dealerHand = [] // Dealer hand
const wins = [0, 0] // The win scores for dealer and player(s)
const show = true // A verbose constant for indicating whether to show or hide a card when being dealt
const hide = false
const showHighestOnly = true // Another verbose constant to indicate whether to show the highest total value of a hand or the array of all values
const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10] // Array for assigning values to each card
const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'] // Suits helper array
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
] // Ranks helper array

let i, j

// Some functions to allow a short-hand of often-used querySelector method calls
const qS = e => document.querySelector(e)
const qSA = e => document.querySelectorAll(e)
const qStC = (cl, cont) => (document.querySelector(cl).textContent = cont)

// Populate the data structure (array) that holds the default card deck of 52 cards
// I did not store image file names in an attribute, instead deriving it on-the-fly
// from rank and suit attribute (see function cardImageName)
const makeDeck = () => {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      deck.push({ rank: ranks[j], suit: suits[i], value: values[j] })
    }
  }
}

// Remove all child tags of a tag given in className.
// This is used in the reset-game routine to remove
// all card images from the previous game.
const removeAllChildren = className => {
  const e = document.querySelector(className)
  let first = e.firstElementChild
  while (first) {
    first.remove()
    first = e.firstElementChild
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

// Calculate the total value of cards given in 'deck' with aces
// counting as 1 or 11.
// Returns an array of all possible hand total values 21 or lower,
// except if the only total value is greater than 21, then
// that total value will be saved in the array.
// showHighestOnly is a boolean argument that, when set to true, returns
// the highest total value only. This is used when the game as over, since
// only one total value should be displayed, not all possible ones.
// showHighestOnly set to false or omitted will return the array mentioned above.
const getDeckValueArray = (deck, showHighestOnly) => {
  const valueArray = []
  let noOfAces = 0
  let sum = 0
  if (typeof showHighestOnly === 'undefined') {
    showHighestOnly = false
  }

  // Calculate the total value of the hand with all aces counting as 1 only.
  // This will be the lowest possible total total value of the hand (if aces are present).
  for (let i = 0; i < deck.length; i++) {
    if (deck[i].value === 11) {
      noOfAces++
      sum += 1
    } else {
      sum += deck[i].value
    }
  }
  // Add the first (=lowest) hand total value to the array
  valueArray.push(sum)

  // If that total is greater than 21 it's a bust and additional totals
  // are not needed, so return with the value array to the caller
  if (sum > 21) {
    if (showHighestOnly) {
      return valueArray[valueArray.length - 1]
    } else {
      return valueArray
    }
  }

  // For each ace in the hand add 10 to the total and push the
  // new total value to the valueArray, but not if the total is
  // above 21
  for (let i = 1; i <= noOfAces; i++) {
    sum += 10
    if (sum > 21) {
      if (showHighestOnly) {
        return valueArray[valueArray.length - 1]
      } else {
        return valueArray
      }
    }
    valueArray.push(sum)
  }
  if (showHighestOnly) {
    return valueArray[valueArray.length - 1]
  } else {
    return valueArray
  }
}

// Show the total value of cards given in hand in
// HTML tag className and return the total value to the caller
const showScore = (hand, className, showHighestOnly) => {
  // Compose the comma-delimited list of possible total hand values, but
  // replace the last comma with an 'or'
  const valueArray = getDeckValueArray(hand)
  let valuesCommaList = ''
  for (let i = 0; i < valueArray.length; i++) {
    valuesCommaList +=
      (valuesCommaList.length > 0
        ? i === valueArray.length - 1
          ? ' or '
          : ', '
        : '') + valueArray[i]
  }

  // Display the hand total in the tag for which the class name has been provided.
  // If class name is missing, skip.
  if (typeof className !== 'undefined') {
    if (typeof showHighestOnly !== 'undefined') {
      qS(className).textContent = showHighestOnly
        ? valueArray[valueArray.length - 1]
        : valuesCommaList
    } else {
      qStC(className, valuesCommaList)
    }
  }
  // Return the highest score as the score
  return valueArray[valueArray.length - 1]
}

// return the name of the card given in card
const cardName = card => {
  return card.rank + ' of ' + card.suit
}

// Update the wins stats indicator by calculating the percentage
// the progress bar has to be at. E.g. a parity score (e.g. 1:1)
// needs to have the progress bar at exactly 50%.
// A score of 1:2 has it at 33% = 1/(1+2) = 1/3
const displayNoOfWins = (countHouse, countPlayer) => {
  // Update the text score
  qStC('.score', countHouse + ':' + countPlayer)
  // If dealer score (wins[0]) and player 1 score (wins[1]) are both zero, the formula to
  // calculate the percentage of the progress bar will fail, because of a division by zero,
  // so that case has to be caught and dealt with separately
  if (wins[0] + wins[1] === 0) {
    qS('#progress-bar-percentage').style.width = '50%'
  } else {
    qS('#progress-bar-percentage').style.width =
      Math.floor(100 * (wins[0] / (wins[0] + wins[1]))) + '%'
  }
}

// Return the path of the corresponding image given the card object in card
const cardImageName = card => {
  // Returns the image file name of a card given its object reference
  // - Assemble the card's name from its properties rank and suit
  // - Convert it to all lowercase
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

// The final check after dealer has played (by not going over 17).
// Display winner/loser message.
const checkScore = () => {
  const houseScore = getDeckValueArray(dealerHand, showHighestOnly)
  const player1Score = getDeckValueArray(player1Hand, showHighestOnly)
  if (houseScore > 21) {
    qS('.message').textContent = 'Dealer loses'
    if (player1Score <= 21) {
      // this check might be redundant because if player's cards weren't 21 or under
      // execution would never have reached here
      wins[1]++
    }
  } else if (player1Score > 21) {
    qS('.message').textContent = qS('.player1Name').textContent + ' loses'
    wins[0]++
  } else if (houseScore > player1Score) {
    qS('.message').textContent =
      (isBlackjack(dealerHand) ? 'Blackjack! ' : '') + 'Dealer wins'
    wins[0]++
  } else if (houseScore < player1Score) {
    qS('.message').textContent =
      (isBlackjack(player1Hand) ? 'Blackjack! ' : '') +
      qS('.player1Name').textContent +
      ' wins'
    wins[1]++
  } else if (dealerHand.length !== player1Hand.length && houseScore === 21) {
    if (dealerHand.length === 2) {
      qS('.message').textContent = 'Blackjack! Dealer wins'
      wins[0]++
    } else if (player1Hand.length === 2) {
      qS('.message').textContent =
        'Blackjack! ' + qS('.player1Name').textContent + ' wins'
      wins[1]++
    } else {
      qS('.message').textContent = 'Push'
    }
  } else {
    qS('.message').textContent = 'Push'
  }
  displayNoOfWins(wins[0], wins[1])
}

// Check if hand is a blackjack by checking the hand value against 21 and
// counting the cards in the hand
const isBlackjack = hand => {
  return getDeckValueArray(hand, showHighestOnly) === 21 && hand.length === 2
}

// Show top of card in deck in tag className
const layDownTopCard = (deck, className, showHide) => {
  // Depending on boolean argument showHide, show the card back image
  // or the actual card image.
  // showHide == true: show image, i.e. image file name is assigned to src attribute
  // showHide == false: show back card image, i.e. image file name is assigned to alt attribute

  const cardImg = document.createElement('img')
  if (showHide) {
    cardImg.src = '/images/' + cardImageName(deck[deck.length - 1])
    cardImg.alt = '/images/card_back.svg'
    // cardImg.alt = 'Value: ' + deck[deck.length - 1].value
  } else {
    cardImg.alt = '/images/' + cardImageName(deck[deck.length - 1])
    cardImg.src = '/images/card_back.svg'
  }
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
  dealCardToPlayer(deck, player1Hand, '.cardsOfPlayer1Container', show)
  // Player 1 busts
  if (showScore(player1Hand, '.player1Score') === 21) {
    housePlays()
  } else if (showScore(player1Hand, '.player1Score') > 21) {
    flipCards('.cardsOfHouseContainer', 'show')
    showScore(dealerHand, '.houseScore', showHighestOnly)
    showScore(player1Hand, '.player1Score', showHighestOnly)
    wins[0]++
    displayNoOfWins(wins[0], wins[1])
    qS('.message').textContent = qS('.player1Name').textContent + ' loses'
    disableButtons()
    qS('.footer').style.display = 'flex'
  }
}
// Deal a new card from fromDeck to toHand and display the card in tag
// with class className. Boolean argument showHide determines whether
// card is face up (true) or face down (false). show and hide have been
// defined as global constants to serve as verbose arguments.
const dealCardToPlayer = (fromDeck, toHand, className, showHide) => {
  moveCardFromTo(fromDeck, toHand)
  layDownTopCard(toHand, className, showHide)
}

// Run the initial steps, giving two cards to dealer and (each) player,
// show total card value for player(s) only
const beginGame = () => {
  // Deal to player, dealer, player, dealer
  dealCardToPlayer(deck, player1Hand, '.cardsOfPlayer1Container', show)
  dealCardToPlayer(deck, dealerHand, '.cardsOfHouseContainer', hide)
  dealCardToPlayer(deck, player1Hand, '.cardsOfPlayer1Container', show)
  dealCardToPlayer(deck, dealerHand, '.cardsOfHouseContainer', show)
  showScore(player1Hand, '.player1Score')
  if (getDeckValueArray(player1Hand, showHighestOnly) === 21) {
    housePlays()
  }
}

// Show, hide or flip/toggle all cards given the container class in className.
// This is done by swapping the contents of the src and alt attributes.
// The swappable content is the file name of the back card image
// (card_back.svg) and the file name of the card image.
const flipCards = (className, type, count) => {
  // className: class name of the container tag inside of which are the img tags
  // type: ('show' | 'hide' | 'toggle')
  // count: how many cards from back end to apply type to (not yet implemented)
  if (typeof count === 'undefined') {
    count = 9999
  }
  if (typeof type === 'undefined') {
    type = 'show'
  }
  // Iterate over all images contained inside HTML-tag with class className
  for (let i = 0; i < Math.min(qS(className).children.length, count); i++) {
    let flip = false
    const alt = qS(className).children[i].alt
    switch (type) {
      case 'show':
        // Show card unconditionally, so ensure 'back' appears in img alt-attribute
        // If it doesn't, set flip to true
        if (alt.indexOf('back') === -1) {
          flip = true
        }
        break
      case 'hide':
        // Hide card unconditionally, so ensure 'back' does not appear in img alt-attribute
        if (alt.indexOf('back') > -1) {
          flip = true
        }
        break
      case 'toggle':
        // Toggle card unconditionally, so no pre-check necessary
        flip = true
        break
    }
    if (flip) {
      qS(className).children[i].alt = qS(className).children[i].src
      qS(className).children[i].src = alt
    }
  }
}

// The steps to run after the player holds/stands and the dealer/house
// plays until finishing the game
const housePlays = () => {
  // Show the dealer's cards' faces
  flipCards('.cardsOfHouseContainer', 'show')
  // The dealer draws a new card as long as the total value is below 17
  while (showScore(dealerHand, '.houseScore') < 17) {
    dealCardToPlayer(deck, dealerHand, '.cardsOfHouseContainer', show)
  }
  // Dealer is done playing, so show the highest values of hands for all players instead of
  // all possible scores that can occur when aces are present
  showScore(dealerHand, '.houseScore', showHighestOnly)
  showScore(player1Hand, '.player1Score', showHighestOnly)
  // Check all player's card value totals and display who is winner/loser
  checkScore()
  // Disable the Player's buttons
  disableButtons()
  // Show the (enabled) reset button
  qS('.footer').style.display = 'flex'
}

// Set up new game after player has pressed 'Play again' button
const resetGame = () => {
  // Refresh deck array and shuffle again
  deck = []
  makeDeck()
  shuffleDeck(deck)
  // Clean out dealer and player hands
  dealerHand = []
  player1Hand = []
  // Clean out winner/loser message
  qS('.message').innerHTML = '&nbsp;'
  // Clean the card scores
  for (i = 0; i < qSA('.playerScore').length; i++) {
    qSA('.playerScore')[i].innerHTML = '&nbsp;'
  }
  // Hide reset button
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

// Prompt user with dialog box to enter player's name and display it
const enterPlayer1Name = () => {
  let newName = ''

  while (newName === '' || newName == null) {
    newName = window.prompt('Please enter your name:')
  }
  qS('.player1Name').textContent = newName
}

const main = () => {
  // Populate the deck array with card objects by utilizing the helper arrays
  makeDeck()
  // Shuffle the deck just created
  shuffleDeck(deck)
  // Start playing the game by dealing first cards and checking scores for blackjacks
  beginGame()
}

// Event handlers
document.addEventListener('DOMContentLoaded', main)
qS('.hitMePlayer1').addEventListener('click', dealCardToPlayer1)
qS('.standPlayer1').addEventListener('click', housePlays)
qS('.reset').addEventListener('click', resetGame)
qS('.player1Name').addEventListener('dblclick', enterPlayer1Name)
