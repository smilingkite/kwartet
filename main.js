const readline = require('readline')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Card(letter, number){
  this.letter = letter;
  this.number = number;
}

var deck;
function deckCards(deck = []){
  for (let i = 1; i< 5; i++){
    for (let j = 0; j < 7; j++) {
      var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
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
}
dealCards(player1, player2, deck)

function sortHand(player){
  var hand = player.hand;
  return hand.sort(function (a, b) {
    var a = a.letter
    var b = b.letter
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    var aNum = a.number
    var bNum = b.number
    if (aNum < bNum) {
      return -1
    }
    if (aNum > bNum) {
      return 1
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
  if (player1.turn) playerTurn = player1;
  else playerTurn = player2;

  function answerToCard(str){
    var letterRegex = /\w/;
    var numberRegex = /\d/;
    var letter = letterRegex.exec(str)
    letter = letter[0]
    var number = numberRegex.exec(str)
    number = number[0]
    var card = new Card(letter, number)
    return card
  }

  function pickCard(player){
    
    console.log('')
    var card = rl.question('Geef letter en nummer van de kaart die je wilt vragen: ', (answer) => {
      
      var pickedCard = answerToCard(answer)
      console.log(`you picked: ${pickedCard.letter}${pickedCard.number}`);
      rl.close();
    });
  }

  pickCard(playerTurn)
}
game(player1, player2)
function changeTurn(){}

function checkKwartet(hand){}

