const readline = require("readline")
const clear = require("clear")

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function Card(letter, number){
  this.letter = letter
  this.number = number
}
const letters = ["A", "B", "C", "D", "E", "F", "G"]
var deck
function deckCards(deck = []){
  for (let i = 1; i< 5; i++){
    for (let j = 0; j < 7; j++) {
      
      var card = new Card(letters[j], i)
      
      deck.push(card)
    }
  }
  return deck
}

function shuffle(array) {
  let counter = array.length

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter)
    counter --
    let temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }
  return array
}
deck = shuffle(deckCards(deck))

function Player(){
  this.hand = []
  this.kwartet = []
  this.turn = false
}
var player1 = new Player
player1.name = "Aafje"
var player2 = new Player
player2.name = "Ben"


function dealCard(player, deck){
  if (deck.length > 0) player.hand.push(deck.shift())
  if (deck.length === 0) console.log("Er zijn geen kaarten meer!")
}

function dealCards(player1, player2, deck){
  for (let i=0; i < 6; i++){
    dealCard(player1, deck)
    dealCard(player2, deck)
  }
  sortHand(player1)
  sortHand(player2)
}
dealCards(player1, player2, deck)

function sortHand(player){
  var hand = player.hand
  return hand.sort(function (a, b) {
    var aa = a.letter
    var bb = b.letter
    var aNum = a.number
    var bNum = b.number

    if (aa < bb || ( aa === bb && aNum < bNum)) {
      return -1
    }
    if (aa > bb || (aa === bb && aNum > bNum)) {
      return 1
    }

    return 0
  })
}
player1.hand = sortHand(player1)
player2.hand = sortHand(player2)


function selectTurn(player1, player2) {
  if (Math.random() < 0.5) {
    player1.turn = true
  } else {
    player2.turn = true
  }
}
selectTurn(player1, player2) 

// Run game! 

function game(player1, player2){
  if (player1.hand.length <1 || player2.hand.length < 1){
    if (deck.length > 0) {
      if (player1.hand.length < 1 && player1.turn) {
        dealCard(player1, deck)
        game(player1, player2)
      } else if (player2.hand.length < 1 && player2.turn){
        dealCard(player2, deck)
        game(player1, player2)
      } if (player1.hand.length < 1 && !player1.turn){
        player2.hand.push(deck)
      } else {
        player1.hand.push(deck)
      }
    }

    checkKwartet(player1)
    checkKwartet(player2)

    let winnaar
    console.log("Het spel is afgelopen!")
    if (player1.kwartet.length < player2.kwartet.length) { winnaar = player2}
    else if (player1.kwartet.length > player2.kwartet.length) { winnaar = player1}
    else { 
      console.log( "Gelijk Spel")
      return rl.close() 
    }

    console.log(`De winnaar is ${winnaar.name} met ${winnaar.kwartet.length} kwartetten.`)

    return rl.close() 
  }
  var playerTurn 
  var otherPlayer
  if (player1.turn) {
    playerTurn = player1
    otherPlayer = player2
  }
  else {
    playerTurn = player2
    otherPlayer = player1
  }

  function answerToCard(str){
    // turns string answer into card object
    str = str.toUpperCase()
    var letterRegex = /\w/
    var numberRegex = /\d/
    try {
      var letter = letterRegex.exec(str)
      letter = letter[0]
    } catch(e) { console.log("Je gaf geen geldige letter op.")}
    try {
      var number = numberRegex.exec(str)
      number = parseInt(number[0], 10) 
    } catch (e) {console.log("Je gaf geen nummer op.")}

    var card = new Card(letter, number)
    return card
  }

  function legitRequestedCard(card, player){
    // checks whether card.letter appears in player.hand
    for (let c of player.hand) {
      if (card.letter === c.letter){ 
        return true
      }
    }
    console.log("Die kaart mag je niet vragen.")
    return false
  }

  function changeTurn(){
    if (playerTurn == player1) {
      player1.turn = false
      player2.turn = true
    } else {
      player1.turn = true
      player2.turn = false 
    }
    clear()
    console.log("De ander is aan de beurt!")
  }
  function displayCardConsole(card){
    return card.letter + card.number
  }

  function checkCardInHand(card, hand){
    var letter = card.letter
    var number = card.number
    if (!letters.includes(letter)) {
      console.log("Je vraagt om een niet-bestaande kaart.")
      return false
    }
    
    for(let i = 0; i < hand.length; i++) {
      if(hand[i].letter == letter && hand[i].number == number) {
        hand.splice(i, 1)
        return true
      }
    }

    return false
  }

  function checkKwartet(player){
    // checks if there are four card objects in the hand with the same letter
    // if so > puts letter in kwartet array
    //       > and deletes those four card objects from hand. 
    var hand = player.hand
    // voor elk van de waarden in letters, count number of objects.
    for (let i = 0; i < letters.length; i++){
      let letter = letters[i]
      let counter = 0

      for(let j = 0; j < hand.length; j++) {
        if(hand[j].letter === letter) {
          counter++
        }

        if (counter === 4) {
          console.log(`KWARTET, je hebt ${letter} compleet!`)
          player.kwartet.push(letter)
          // delete alle kaarten met die letter uit hand. 
     
          let newHand = hand.filter(function (el) {
            return (el.letter !== letter)
          })
          player.hand = newHand
          break
        }
      }
    }
  }

  function kwartetGame(player){
    
    console.log("")
    rl.question("Geef letter en nummer van de kaart die je wilt vragen: ", (answer) => {
      
      var pickedCard = answerToCard(answer)
      
      if (legitRequestedCard(pickedCard, playerTurn) && checkCardInHand(pickedCard, otherPlayer.hand) ) {
        console.log(`Goeie gok: ik heb de kaart ${displayCardConsole(pickedCard)}!`)
        playerTurn.hand.push(pickedCard)
        sortHand(playerTurn)
        checkKwartet(player)
        return game(player1, player2)
      } else {
        const nextCard = deck[0]
        dealCard(playerTurn, deck)
        checkKwartet(player)
        sortHand(playerTurn)
        console.log("Je trekt kaart", displayCardConsole(nextCard), "van de stapel")
        changeTurn()
        return game(player1, player2)
      }
    })
  }
  console.log("Dit zijn je kaarten: ")
  console.log(playerTurn.hand)
  kwartetGame(playerTurn)

  // *** Tests
  // checkKwartet(playerTest)
  // console.log(playerTest.kwartet)
  // console.log(playerTest.hand)
  // checkKwartet(playerTest2)
  // console.log(playerTest2.kwartet)
  // console.log(playerTest2.hand)
}
// var playerTest = new Player;
// playerTest.hand = [ 
//   { letter: 'A', number: 2 },
//   { letter: 'A', number: 4 },
//   { letter: 'B', number: 4 },
//   { letter: 'F', number: 1 }, 
//   { letter: 'F', number: 3 }, 
//   { letter: 'F', number: 4 },
//   { letter: 'G', number: 1 },
//   { letter: 'G', number: 2 },
//   { letter: 'G', number: 3 }, 
//   { letter: 'G', number: 3 },  
// ]
// var playerTest2 = new Player;
// playerTest2.hand = [ 
//   { letter: 'A', number: 2 },
//   { letter: 'A', number: 4 },
//   { letter: 'B', number: 4 },
//   { letter: 'B', number: 4 },
//   { letter: 'B', number: 4 },
//   { letter: 'B', number: 4 },
//   { letter: 'F', number: 1 }, 
//   { letter: 'F', number: 3 }, 
//   { letter: 'F', number: 4 },
//   { letter: 'G', number: 1 },
//   { letter: 'G', number: 2 },  
// ]

game(player1, player2)

