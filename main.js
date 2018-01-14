const readline = require('readline')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Card(letter, number){
  this.letter = letter;
  this.number = number;
}
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
var deck;
function deckCards(deck = []){
  for (let i = 1; i< 5; i++){
    for (let j = 0; j < 7; j++) {
      
      var card = new Card(letters[j], i)
      
      deck.push(card)
    }
  }
  return deck;
};

function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter --;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
deck = shuffle(deckCards(deck));

function Player(){
  this.hand = [];
  this.kwartet = [];
  this.turn = false;
  this.requestableCards = [];
}
var player1 = new Player;
var player2 = new Player;

function dealCard(player, deck){
  player.hand.push(deck.shift())
}

function dealCards(player1, player2, deck){
  for (let i=0; i < 6; i++){
    dealCard(player1, deck)
    dealCard(player2, deck)
  }
  sortHand(player1);
  sortHand(player2);
}
dealCards(player1, player2, deck)

function sortHand(player){
  var hand = player.hand;
  return hand.sort(function (a, b) {
    var aa = a.letter
    var bb = b.letter
    var aNum = a.number
    var bNum = b.number

    if (aa < bb || ( aa === bb && aNum < bNum)) {
      return -1;
    }
    if (aa > bb || (aa === bb && aNum > bNum)) {
      return 1;
    }

    return 0;
  })
}
player1.hand = sortHand(player1)
player2.hand = sortHand(player2)

function selectTurn(player1, player2) {
  if (Math.random() < 0.5) {
    player1.turn = true;
  } else {
    player2.turn = true;
  }
}
selectTurn(player1, player2) 

// Run game! 

function game(player1, player2){
  var playerTurn ;
  var otherPlayer;
  if (player1.turn) {
    playerTurn = player1
    otherPlayer = player2
  }
  else {
    playerTurn = player2
    otherPlayer = player1
  };

  function answerToCard(str){
    // turns string answer into card object
    str = str.toUpperCase();
    var letterRegex = /\w/;
    var numberRegex = /\d/;
    try {
      var letter = letterRegex.exec(str)
      letter = letter[0]
    } catch(e) { console.log('Je gaf geen geldige letter op.')}
    try {
      var number = numberRegex.exec(str)
      number = number[0]
    } catch (e) {console.log('Je gaf geen nummer op.')}

    var card = new Card(letter, number)
    return card
  }

  function changeTurn(){
    if (playerTurn == player1) {
      player1.turn = false;
      player2.turn = true;
    } else {
      player1.turn = true;
      player2.turn = false; 
    }
    console.log('')
    console.log('De ander is aan de beurt!')
  }
  function displayCardConsole(card){
    var card = card.letter + card.number
    return card
  }

  function checkCardInHand(card, hand){
    var letter = card.letter;
    var number = card.number;
    if (!letters.includes(letter)) {
      console.log('Je vraagt om een niet-bestaande kaart.')
      return false
    }
    
    for(var i = 0; i < hand.length; i++) {
      if(hand[i].letter == letter && hand[i].number == number) {
          hand.splice(i, 1);
          return true
      }
  }

  return false
  }

  function pickCard(player){
    
    console.log('')
    var card = rl.question('Geef letter en nummer van de kaart die je wilt vragen: ', (answer) => {
      
      var pickedCard = answerToCard(answer)
      if (checkCardInHand(pickedCard, otherPlayer.hand)) {
        console.log('Goeie gok: ik heb de kaart!');
        // take card from otherPlayer.hand, put it into playerTurn.hand
        playerTurn.hand.push(pickedCard);
        sortHand(playerTurn);
        // console.log('Je hebt nu de volgende kaarten:')
        console.log(playerTurn.hand)
        return game(player1, player2)
      } else {
        dealCard(playerTurn, deck)
        sortHand(playerTurn);
        console.log('Je trekt kaart', displayCardConsole(playerTurn.hand[playerTurn.hand.length-1]), 'van de stapel')
        changeTurn()
        return game(player1, player2)
      };
      rl.close();
    });
  }
  console.log('Dit zijn je kaarten: ')
  // playerTurn.hand.forEach(displayCardConsole(Card))
  console.log(playerTurn.hand)
  pickCard(playerTurn)
}
game(player1, player2)


function checkKwartet(hand){}

