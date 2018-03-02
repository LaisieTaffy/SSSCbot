//Variables
var ranks = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
var suits = [ "Spade", "Heart", "Club", "Diamond" ];

//Card object
function Card(r, s) {
	this.rank = "" + r;
	this.suit = "" + s;
	this.value = 0;
}

//Deck object
function Deck(){
	var iSuits = 0,
		totalCards = 0;
	var cards = [];
	while (iSuits < 4) {
		var iRanks = 0;
		while (iRanks < 13) {
			cards[totalCards] = new Card( ranks[iRanks], suits[iSuits] );
			iRanks++;
			totalCards++;
		}
		iSuits++;
	}

	//Deck of cards to call from outside
	this.allCards = cards;
	
}

//Shuffle
function shuffle(deck) {
	var i = deck.allCards.length;
	while (--i) {
		var j = Math.floor(Math.random() * deck.allCards.length);
		var iTemp = deck.allCards[i];
		var jTemp = deck.allCards[j];
		deck.allCards[i] = jTemp;
		deck.allCards[j] = iTemp;
	}
}

//Draw
function draw(deck) {
	if (deck.allCards.length != 0) {
		var drawn = deck.allCards.pop();
		return drawn;
	}
}

//Hand
function Hand() {
	var holeCards = [];
	this.hand = holeCards;
	var val = 0;
	this.value = val;
}

//Add to hand
function addToHand(h, card) {
	h.hand[h.hand.length] = card;
}

//Calculate hand
function handCalculate(h){
	var calc = 0,
		i = 0;
	var tempHand = [];
	var aceInHand = false;
	while (i < h.hand.length) {
		if (h.hand[i].rank == "J" || h.hand[i].rank == "Q" || h.hand[i].rank == "K") {
			if (aceInHand) {
				if ((calc + 10) > 21){
					calc -= 10;
				}
			}
			h.hand[i].value = 10;
		}
		else if (h.hand[i].rank == "A") {
			if ((calc + 11) < 22) {
				h.hand[i].value = 11;
			}
			else {
				h.hand[i].value = 1;
			}
			aceInHand = true;
		}
		else {
			if (aceInHand) {
				if ((calc + h.hand[i].rank * 1) > 21){
					calc -= 10;
				}
			}
			h.hand[i].value = h.hand[i].rank;
		}
		calc += h.hand[i].value * 1;
		i++;
	}
	return calc;
}