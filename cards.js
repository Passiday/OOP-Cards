class Card {
  // public class fields in Chrome since V72. In Firefox: experimental feature
  type = Card.TYPE_NORMAL;
  style;
  back;
  
  constructor(type, suit, rank) {
    this.type = type;
    if (type === Card.TYPE_NORMAL) {
      this.suit = suit;
      this.rank = rank;
    }
  }
  getSuitSymbol() {
    switch(this.suit) {
      case Card.SUIT_CLUBS:
      return "♣";
      case Card.SUIT_DIAMONDS:
      return "♦";
      case Card.SUIT_HEARTS:
      return "♥";
      case Card.SUIT_SPADES:
      return "♠";
    }
  }
  toString() {
    if(this.isNormal()) {
      if(this.rank < 11) {
        return this.rank + this.getSuitSymbol();
      } else {
        switch(this.rank) {
          case 11:
            return "J" + this.getSuitSymbol();
          case 12:
            return "Q" + this.getSuitSymbol();
          case 13:
            return "K" + this.getSuitSymbol();
          case 14:
            return "A" + this.getSuitSymbol();
        }
      }
    } else {
      return "★";
    }
  }

  isNormal() {
    return this.type === Card.TYPE_NORMAL;
  }

  isJoker() {
    return this.type === Card.TYPE_JOKER;
  }
}

Card.TYPE_NORMAL = 0;
Card.TYPE_JOKER = 1;
Card.SUIT_HEARTS = 0;
Card.SUIT_SPADES = 1;
Card.SUIT_CLUBS = 2;
Card.SUIT_DIAMONDS = 3;

class CardSet {
  cards = [];

  addCard(card) {
    this.cards.push(card);
  }

  get count() {
    return this.cards.length;
  }

  getRandomSet(count) {
    // Makes a new CardSet object
    // Fills it with <count> random cards from the current set
    // Removes these cards from the current set
    // Returns the new set
    let cardSet = new CardSet();
    for(let x = 0; x < count; x++) {
      let val = Math.floor(Math.random()*this.cards.length);
      cardSet.addCard(this.cards[val]);
      this.cards.splice(val, 1);
    }
    return cardSet;
  }

  shuffle() {
    this.cards.sort(() => .5 - Math.random());
  }

  takeTopCards(count) {
    if (this.cards.length < count) throw new Error("Not enough cards in set");
    return this.cards.splice(0, count);
  }

  fillUpTo(fromSet, count) {
    let toBeAdded = count - this.cards.length;
    if (toBeAdded <= 0) return;
    this.cards = this.cards.concat(fromSet.takeTopCards(toBeAdded));
  }
}

CardSet.standardPack = (withJokers) => {
  let cardSet = new CardSet();
  let suits = [
    Card.SUIT_HEARTS,
    Card.SUIT_SPADES,
    Card.SUIT_CLUBS,
    Card.SUIT_DIAMONDS
  ];
  suits.forEach((suit) => {
    for (let rank = 1; rank <= 13; rank++) {
        cardSet.addCard(new Card(Card.TYPE_NORMAL, suit, rank));
    }
  });
  if (withJokers) {
    cardSet.addCard(new Card(Card.TYPE_JOKER));
    cardSet.addCard(new Card(Card.TYPE_JOKER));  
  }
  return cardSet;
};
