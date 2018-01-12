var deck;
function deckCards(deck = []){
  for (let i = 1; i< 5; i++){
    for (let j = 0; j < 7; j++) {
      var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      var card = letters[j] + i;
      
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

function Player(hand = [], kwartet = []){
  this.hand = hand;
  this.kwartet = kwartet;
  this.beurt = false;
}
var player1 = new Player;
var player2 = new Player;

function selectBeurt(player1, player2) {
  if (Math.random() < 0.5) {
    player1.beurt = true;
  } else {
    player2.beurt = true;
  }
}
selectBeurt(player1, player2) 
console.log(player1)
console.log(player2)

function hand(){

}

function dealCards(){

}