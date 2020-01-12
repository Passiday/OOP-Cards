class CukasGameException{
    constructor(type,message){
        this.type = type;
        this.message = message;
    }
    toString(){
        return `Type: ${this.type}, message: ${this.message}`;
    }
}
class CukasGame {
    players = []; // 2-6 players
    deck = null; // CardSet
    trump = null; // Card
    attack = []; // Attack cards
    defence = []; // Defence cards

    gameState;
    activePlayerId;
    turnPhase;

    //Constructor 1 - creates a regular game object with 2 to 6 players.
    constructor(playerCount) {
        this.controller = null;
        if(isNaN(playerCount) || playerCount < 2 || playerCount > 6) {
            throw new CukasGameException("player count",`Can't make a game with ${playerCount} players`);
        }
        this.playerCount = playerCount;
        this.gameState = CukasGame.STATE_UNINITIALIZED
    }

    init() {
        this.gameState = CukasGame.STATE_INIT;
        this.deck = CardSet.standardPack();
        // TODO: shuffle the deck and then just give the players top 6 cards. Also, just pick the trump card from the top.
        for(let x = 0; x < this.playerCount; x++) {
            const playerHand = this.deck.getRandomSet(6);
            this.players[x] = new CukasPlayer(playerHand);
            this.event("hand", {playerId:x, cards:playerHand});
        }
        this.trump = this.deck.getRandomSet(1);
        this.deck.addCard(this.trump); // TODO: Must add at the end

        this.gameState = CukasGame.STATE_GAME;

        this.event("supply", {cards:this.deck, trump:this.trump});
    }

    event(eventType, eventInfo) {
        if (!this.controller) return;
        this.controller.update(eventType, eventInfo);
    }

    //method that return a ready-to-send info about the situation about the game
    createPerspective(playerId) {
        var otherHands=[];//int[] contains number of cards for the next players in order
        for (var i = playerId; i != playerId; i=(i+1)%this.players.length) {//fills otherHands array
          otherHands.push(this.players[i].count);
        }
        var playersState=0;
        //CukasPlayerPerspective.STATE_WAITING;
        if(playerId==this.activePlayerId) playersState = 1
        //CukasPlayerPerspective.STATE_ATTACKING;
        if(playerId==(this.activePlayerId+1)%this.players.length) playersState = 2;
        //CukasPlayerPerspective.STATE_DEFENDING;
        //var Perspective=new CukasPlayerPerspective(CardSet.copy(his.players[playerId].hand), [...this.attack], [...this.defence], otherHands, Card.copy(this.trump), playersState);
        //{hand,attack,defence,otherHands,trumpis,state}
        return {hand: CardSet.copy(this.players[playerId].hand), 
            attack: [...this.attack], 
            defence: [...this.defence], 
            others: otherHands, 
            trump: Card.copy(this.trump), 
            state: playersState};
    }

    turn() {
        const attackPlayerId = this.activePlayerId;
        const defencePlayerId = (this.activePlayerId + 1) % this.players.length;
        this.turnPhase = CukasGame.PHASE_ATTACK;
        const attack = this.players[attackPlayerId].attack(this.createPerspective(attackPlayerId));
        let valid = true;
        for(let x = 0; x < attack.length; x++) {
            if(!this.players[attackPlayerId].hand.includes(attack[x])) { //make sure they actually have the cards
                valid = false;
            }
        }
        if(!valid) {
            throw new CukasGameException("invalid move","Invalid attack"); //preferably, this should just reask for an attack, but I have no idea how to do that without making a huge mess
        }
        for(let x = 0; x < attack.length; x++) {
            this.players[attackPlayerId].hand = this.players[attackPlayerId].hand.splice(this.players[attackPlayerId].hand.indexOf(attack[x]), 1); //take the cards out of the deck
        }
        this.attack = attack;
        this.turnPhase = CukasGame.PHASE_DEFEND;
        const defence = this.players[defencePlayerId].defend(this.getGameInfo());
        if(defence == null) { //if null, just pick up the attack cards
            this.players[defencePlayerId].deck.push(attack);
            if(this.players[attackPlayerId].hand.length - 6 < 0) {
                this.players[attackPlayerId].hand.push(this.deck.getRandomSet(Math.abs(this.players[attackPlayerId].hand.length - 6))); //make sure the attacker ends turn with 6 cards in hand
            }
            return;
        }
        valid = true;
        for(let x = 0; x < attack.length; x++) {
            if(!this.players[defencePlayerId].hand.includes(defence[x])) { //make sure defence has the cards
                valid = false;
            }
            if(defence[x].suit != this.trump[0].suit) { //make sure the cards can beat the attack cards
                if(attack[x].suit != defence[x].suit) {
                    valid = false;
                } else {
                    if(attack[x].rank > defence[x].rank) {
                        valid = false;
                    }
                }
            } else {
                if(attack[x].suit == this.trump.suit) { //likewise here
                    if(attack[x].rank > defence[x].rank) {
                        valid = false;
                    }
                }
            }
        }
        if(!valid) {
            this.players[attackPlayerId].hand.push(attack); //put attack cards back in hand
            throw new CukasGameException("invalid move","Invalid defence")
        }
        for(let x = 0; x < attack.length; x++) {
            this.players[defencePlayerId].hand = this.players[defencePlayerId].hand.splice(this.players[defencePlayerId].hand.indexOf(defence[x]), 1); //remove played cards from hand
        }
        this.defence = defence;
        if(this.players[attackPlayerId].hand.length - 6 < 0) {
            this.players[attackPlayerId].hand.push(this.deck.getRandomSet(Math.abs(this.players[attackPlayerId].hand.length - 6))); //make sure attack has 6 cards
        }
        if(this.players[defencePlayerId].hand.length - 6 < 0) {
            this.players[defencePlayerId].hand.push(this.deck.getRandomSet(Math.abs(this.players[attackPlayerId].hand.length - 6))); //make sure defence has 6 cards
        }
        //console.log(this.players);

    }
    compareCards(a,b){//1 - a>b -1 - a<b 0 - a=b
      if(a.type==Card.TYPE_JOKER && b.type!=Card.TYPE_JOKER)return 1;
      if(a.type==Card.TYPE_JOKER && b.type==Card.TYPE_JOKER)return 0;
      if(b.type==Card.TYPE_JOKER)return -1;
      const a_trump=a.suit==trump;
      const b_trump=b.suit==trump;
      if(a.suit==b.suit){
        return Math.sign(a.rank-b.rank);
      } else if(a_trump || b_trump) {
          if(a_trump)return 1;
          if(b_trump)return -1;
      }
      console.warn("Warning: these are not comparable");
      return false;
    }
}

CukasGame.STATE_UNINITIALIZED = 0;
CukasGame.STATE_INIT = 1;
CukasGame.STATE_GAME = 2;
CukasGame.STATE_FINISHED = 3;

CukasGame.PHASE_ATTACK = 1;
CukasGame.PHASE_DEFEND = 2;

class CukasPlayer {
    hand = null; // CardSet

    //Constructor - initialises this class with a basic hand.
    CukasPlayer(initialHand) {
        this.hand = initialHand;
    }
attack(perspective) {
        // Returns array of attack cards
        if(hand.length > 0) {
            return hand[0];
        }
    }

    defend(gameInfo) {
        // Returns array of defence cards or null, if the player picks up
        return null;
    }
}
/*
class CukasPlayerPerspective {//container for info about specific users
  hand;//current players hand (CardSet)
  attack;//cards attacking
  defence;//cards defending
  otherHandCount;//amount of cards of other players
  trump;//trump card
  state;
  constructor(iHand, iAttack, iDefence, iOtherHandCount, iTrump, iState){//i as in input NOT apple products
    hand=iHand;
    attack=iAttack;
    defence=iDefence;
    otherHandCount=iOtherHandCount;
    trump=iTrump;
    state=iState;
  }
}
CukasPlayerPerspective.STATE_ATTACKING = 0;//various states
CukasPlayerPerspective.STATE_DEFENDING = 1;
CukasPlayerPerspective.STATE_WAITING = 2;
*/
