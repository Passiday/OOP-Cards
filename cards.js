class Card {
  // public class fields in Chrome since V72. In Firefox: experimental feature
  type = Card.TYPE_NORMAL;
  style;
  back;
  
  constructor(type, suit, rank) {
    this.type = type;
    if (type == Card.TYPE_NORMAL) {
      this.suit = suit;
      this.rank = rank;
    }
  }

  toString() {
    if(this.isNormal()) {
      if(this.rank < 11) {
        switch(this.suit) {
          case Card.SUIT_CLUBS:
          return rank + "♣";
          case Card.SUIT_DIAMONDS:
          return rank + "♦";
          case Card.SUIT_HEARTS:
          return rank + "♥";
          case Card.SUIT_SPADES:
          return rank + "♠";
        }
      } else {
        switch(this.rank) {
          case 11:
              switch(this.suit) {
                case Card.SUIT_CLUBS:
                return "J" + "♣";
                case Card.SUIT_DIAMONDS:
                return "J" + "♦";
                case Card.SUIT_HEARTS:
                return "J" + "♥";
                case Card.SUIT_SPADES:
                return "J" + "♠";
              }
              break;
          case 12:
              switch(this.suit) {
                case Card.SUIT_CLUBS:
                return "Q" + "♣";
                case Card.SUIT_DIAMONDS:
                return "Q" + "♦";
                case Card.SUIT_HEARTS:
                return "Q" + "♥";
                case Card.SUIT_SPADES:
                return "Q" + "♠";
              }
              break;
          case 13:
            switch(this.suit) {
              case Card.SUIT_CLUBS:
              return "K" + "♣";
              case Card.SUIT_DIAMONDS:
              return "K" + "♦";
              case Card.SUIT_HEARTS:
              return "K" + "♥";
              case Card.SUIT_SPADES:
              return "K" + "♠";
            }
            break;
          case 14:
              switch(this.suit) {
                case Card.SUIT_CLUBS:
                return "A" + "♣";
                case Card.SUIT_DIAMONDS:
                return "A" + "♦";
                case Card.SUIT_HEARTS:
                return "A" + "♥";
                case Card.SUIT_SPADES:
                return "A" + "♠";
              }
              break;
        }
      } 
    } else {
      return "★";
    }
  }

  isNormal() {
    return this.type == Card.TYPE_NORMAL;
  }

  isJoker() {
    return this.type == Card.TYPE_JOKER;
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
}
