class CukasGame {
    players = []; // 2-6 players
    deck = null; // CardSet
    trump = null; // Card
    attack = []; // Attack cards
    defence = []; // Defence cards
​
    gameState;
    activePlayerId;
    turn = 0;
    turnPhase;
​
    //Constructor 1 - creates a regular game object with 2 to 6 players.
    CukasGame(playerCount) {
        if(playerCount < 2) {
            throw "Can't make a game with 1 player";
        }
        if(playerCount > 6) {
            throw "Can't make a game with more than 6 players";
        }
        this.gameState = STATE_INIT;
        this.deck = CardSet.standardPack();
        for(let x = 0; x < playerCount; x++) {
            players[x] = new CukasPlayer(this.deck.getRandomSet(6));
        }
        this.trump = this.deck.getRandomSet(1);
        this.deck.push(trump);
        this.gameState = STATE_GAME;
    }
​
    //Constructor 2 - used for creating snapshots of the game
    CukasGame(parent, state) {
        this.trump = parent.trump;
        switch(state) {
            case PHASE_ATTACK:
                this.players = parent.player[parent.activePlayerId];
                break;
            case PHASE_DEFEND:
                this.players = parent.player[(parent.activePlayerId + 1) % parent.players.length];
                this.attack = parent.attack;
                break;
        }
    }
​
    getGameInfo() {
        return new CukasGame(this, this.turnPhase);
    }
​
    turn() {
        const attackPlayerId = this.activePlayerId;
        const defencePlayerId = (this.activePlayerId + 1) % this.players.length;
        this.turnPhase = CukasGame.PHASE_ATTACK;
        const attack = this.players[attackPlayerId].attack(this.getGameInfo());
        let valid = true;
        for(let x = 0; x < attack.length; x++) {
            if(!this.players[attackPlayerId].hand.includes(attack[x])) { //make sure they actually have the cards
                valid = false;
            }
        }
        if(!valid) {
            throw "Invalid attack!"; //preferably, this should just reask for an attack, but I have no idea how to do that without making a huge mess
        }
        for(let x = 0; x < attack.length; x++) {
            this.players[attackPlayerId].hand = this.players[attackPlayerId].hand.splice(this.players[attackPlayerId].hand.indexOf(attack[x]), 1); //take the cards out of the deck
        }
        this.attack = attack;
        this.turnPhase = CukasGame.PHASE_DEFEND;
        const defence = this.players[defencePlayerId].defend(this.getGameInfo());
        //console.log(attack);
        //console.log(defence);
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
            throw "Invalid defence!"; //same as the invalid attack error
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
}
​
CukasGame.STATE_INIT = 1;
CukasGame.STATE_GAME = 2;
CukasGame.STATE_FINISHED = 3;
​
CukasGame.PHASE_ATTACK = 1;
CukasGame.PHASE_DEFEND = 2;
​
class CukasPlayer {
    hand = null; // CardSet
​
    //Constructor - initialises this class with a basic hand.
    CukasPlayer(initialHand) {
        this.hand = initialHand;
    }
​
    attack(gameInfo) {
        // Returns array of attack cards
        if(hand.length > 0) {
            return hand[0];
        }
    }
​
    defend(gameInfo) {
        // Returns array of defence cards or null, if the player picks up
        return null;
    }
}
Collapse




