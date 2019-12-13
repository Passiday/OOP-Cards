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
      let symbol=this.getSuitSymbol();
      switch(this.rank) {
        case Card.RANK_JACK:
          return "J" + symbol;
        case Card.RANK_QUEEN:
          return "Q" + symbol;
        case Card.RANK_KING:
          return "K" + symbol;
        case Card.RANK_ACE:
          return "A" + symbol;
        default:
          return this.rank + symbol;
      }
    } else {
      return "★";
    }
  }

  log() {
    const str = this.toString();
    if(str.includes("♥") || str.includes("♦"))
      console.log(str.replace(/♥|♦/g, "%c$&"), "color: red")
    else
      console.log(str);
  }

  isNormal() {
    return this.type === Card.TYPE_NORMAL;
  }

  isJoker() {
    return this.type === Card.TYPE_JOKER;
  }
  copy(){
    return new Card(this.type, this.suit, this.rank);
  }
}

Card.RANK_ACE = 1;
Card.RANK_JACK = 11;
Card.RANK_QUEEN = 12;
Card.RANK_KING = 13;

Card.TYPE_NORMAL = 0;
Card.TYPE_JOKER = 1;
Card.SUIT_HEARTS = 0;
Card.SUIT_SPADES = 1;
Card.SUIT_CLUBS = 2;
Card.SUIT_DIAMONDS = 3;

class CardSet {
  cards = [];
  constructor(cards) {
    this.cards = cards || [];
  }
  addCard(card) {
    this.cards.push(card);
  }

  get count() {
    return this.cards.length;
  }

  asArray(){
    return this.cards.map(x => x.copy());
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
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  takeTop(count) {
    if (this.cards.length < count) throw new Error("Not enough cards in set");
    return new CardSet(this.cards.splice(0, count));
  }

  fillUpTo(fromSet, count) {
    let toBeAdded = count - this.cards.length;
    if (toBeAdded <= 0) return;
    this.cards = this.cards.concat(fromSet.takeTop(toBeAdded));
  }
  copy(){
    return new CardSet(this.cards);
  }
  toString() {
    return this.cards.join(", ");
  }

  log() {
    const str = this.toString();
    let arr = [];
    for(var x = 0; x < (str.match(/♥|♦/g) || []).length; x++) {
      arr.push("color:red");
      arr.push("color:black");
    }
    console.log(str.replace(/♥|♦/g, "%c$&%c"), ...arr);
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
