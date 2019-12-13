class CukasGame {
    players = []; // 2-6 players
    deck = null; // CardSet
    trump = null; // Card
    attack = []; // Attack cards
    defence = []; // Defence cards
    hands = []; //player hands

    gameState;
    activePlayerId;
    turnPhase;


    //Constructor 1 - creates a regular game object with 2 to 6 players.
    constructor(playerCount) {
        if(playerCount < 2) {
            throw "Can't make a game with 1 player";
        }
        if(playerCount > 6) {
            throw "Can't make a game with more than 6 players";
        }
        this.gameState = CukasGame.STATE_INIT;
        this.deck = CardSet.standardPack();
        for(let x = 0; x < playerCount; x++) {
            this.players[x] = new CukasPlayer();
            this.hands[x] = this.deck.getRandomSet(6);
        }
        this.trump = this.deck.getRandomSet(1);
        this.deck.addCard(this.trump);
        this.gameState = CukasGame.STATE_GAME;
        this.activePlayerId = 0;
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
        return {hand:this.hands[playerId].copy(), attack:[...this.attack], defence:[...this.defence], others:otherHands, trump:this.trump.copy(), state:playersState};
    }

    turn() {
        const attackPlayerId = this.activePlayerId;
        const defencePlayerId = (this.activePlayerId + 1) % this.players.length;
        this.turnPhase = CukasGame.PHASE_ATTACK;
        const attack = this.players[attackPlayerId].attack(this.createPerspective(attackPlayerId));
        let valid = true;
        for(let x = 0; x < attack.length; x++) {
            if(!this.hands[attackPlayerId].includes(attack[x])) { //make sure they actually have the cards
                valid = false;
            }
        }
        if(!valid) {
            throw "Invalid attack!"; //preferably, this should just reask for an attack, but I have no idea how to do that without making a huge mess
        }
        console.log("Player " + attackPlayerId + " attacks with:");
        new CardSet(attack).log();
        console.log("Player " + attackPlayerId + " had this hand:");
        this.hands[attackPlayerId].log();
        for(let x = 0; x < attack.length; x++) {
            this.hands[attackPlayerId].cards.splice(this.hands[attackPlayerId].indexOf(attack[x]), 1); //take the cards out of the deck
        }
        this.attack = attack;
        this.turnPhase = CukasGame.PHASE_DEFEND;
        const defence = this.players[defencePlayerId].defend(this.createPerspective(defencePlayerId));
        if(defence == null) { //if null, just pick up the attack cards
            console.log("Player " + defencePlayerId + " picks up the cards.");
            console.log("Player " + defencePlayerId + " had this hand:");
            this.hands[defencePlayerId].log();
            this.hands[defencePlayerId].cards.push(...attack); //add attack cards to defenders deck
            if(this.hands[attackPlayerId].count - 6 < 0) {
                this.hands[attackPlayerId].cards.push(this.deck.getRandomSet(Math.abs(this.hands[attackPlayerId].count - 6))); //make sure the attacker ends turn with 6 cards in hand
            }
            return;
        }
        valid = true;
        for(let x = 0; x < attack.length; x++) {
            if(!this.hands[defencePlayerId].includes(defence[x])) { //make sure defence has the cards
                valid = false;
            }
            //TODO: Make a card comparison function in Card class
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
            this.hands[attackPlayerId].push(attack); //put attack cards back in hand
            throw "Invalid defence!"; //same as the invalid attack error
        }

        console.log("Player " + defencePlayerId + " defends with:")
        new CardSet(defence).log();
        console.log("Player " + defencePlayerId + " had this hand:");
        this.hands[defencePlayerId].log();
        for(let x = 0; x < attack.length; x++) {
           this.hands[defencePlayerId].splice(this.hands[defencePlayerId].indexOf(defence[x]), 1); //remove played cards from hand
        }
        this.defence = defence;
        if(this.hands[attackPlayerId].length - 6 < 0) {
            this.hands[attackPlayerId].push(this.deck.getRandomSet(Math.abs(this.hands[attackPlayerId].length - 6))); //make sure attack has 6 cards
        }
        if(this.hands[defencePlayerId].length - 6 < 0) {
            this.hands[defencePlayerId].push(this.deck.getRandomSet(Math.abs(this.hands[attackPlayerId].length - 6))); //make sure defence has 6 cards
        }
        this.activePlayerId = (this.activePlayerId + 1) % this.players.length; //increment active player id
        //console.log(this.players);
    }
}

CukasGame.STATE_INIT = 1;
CukasGame.STATE_GAME = 2;
CukasGame.STATE_FINISHED = 3;

CukasGame.PHASE_ATTACK = 1;
CukasGame.PHASE_DEFEND = 2;

class CukasPlayer {


    attack(gameInfo) {
        // Returns array of attack cards
        let arr = [];
        if(gameInfo.hand.count > 0) {
            arr.push(gameInfo.hand.cards[0]);
            return arr;
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
